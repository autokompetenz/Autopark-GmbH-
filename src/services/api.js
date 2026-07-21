import { supabase } from './supabase';

// ── HELPERS ───────────────────────────────────────────────────────────────────
function ok(data) { return { data }; }
function err(msg) { const e = new Error(msg); e.response = { data: { error: msg } }; throw e; }

async function getUserProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}

function mapProfile(p) {
  return {
    id: p.id,
    username: p.username,
    email: p.email,
    firstName: p.first_name,
    lastName: p.last_name,
    phone: p.phone,
    address: p.address,
    monthlySalary: p.monthly_salary,
    role: p.role,
    emailVerified: p.email_verified,
  };
}

function mapCar(c) {
  if (!c) return c;
  return {
    id: c.id,
    make: c.make,
    model: c.model,
    year: c.year,
    price: c.price,
    stock: c.stock,
    description: c.description,
    fuelType: c.fuel_type,
    transmission: c.transmission,
    mileage: c.mileage,
    color: c.color,
    power: c.power,
    category: c.category,
    imageUrl: c.image_url,
    imageUrl2: c.image_url_2,
    imageUrl3: c.image_url_3,
    imageUrl4: c.image_url_4,
    imageUrl5: c.image_url_5,
    imageUrl6: c.image_url_6,
    imageUrl7: c.image_url_7,
    imageUrl8: c.image_url_8,
    imageUrl9: c.image_url_9,
    imageUrl10: c.image_url_10,
    imageUrl11: c.image_url_11,
    imageUrl12: c.image_url_12,
    imageUrl13: c.image_url_13,
    imageUrl14: c.image_url_14,
    imageUrl15: c.image_url_15,
    imageUrl16: c.image_url_16,
    imageUrl17: c.image_url_17,
    imageUrl18: c.image_url_18,
    imageUrl19: c.image_url_19,
    imageUrl20: c.image_url_20,
    minSalary: c.min_salary,
    monthlyPayment: c.monthly_payment,
    featured: c.featured,
    promotional: c.promotional,
    isActive: c.is_active,
    createdAt: c.created_at,
    campingCar: c.camping_car,
  };
}

function unmapCar(d) {
  const o = {};
  if (d.make !== undefined) o.make = d.make;
  if (d.model !== undefined) o.model = d.model;
  if (d.year !== undefined) o.year = parseInt(d.year);
  if (d.price !== undefined) o.price = parseFloat(d.price);
  if (d.stock !== undefined) o.stock = parseInt(d.stock);
  if (d.description !== undefined) o.description = d.description;
  if (d.fuelType !== undefined) o.fuel_type = d.fuelType;
  if (d.transmission !== undefined) o.transmission = d.transmission;
  if (d.mileage !== undefined) o.mileage = parseInt(d.mileage);
  if (d.color !== undefined) o.color = d.color;
  if (d.power !== undefined) o.power = parseInt(d.power);
  if (d.category !== undefined) o.category = d.category;
  if (d.minSalary !== undefined) o.min_salary = d.minSalary;
  if (d.monthlyPayment !== undefined) o.monthly_payment = d.monthlyPayment;
  if (d.featured !== undefined) o.featured = d.featured;
  if (d.promotional !== undefined) o.promotional = d.promotional;
  if (d.isActive !== undefined) o.is_active = d.isActive;
  if (d.campingCar !== undefined) o.camping_car = d.campingCar;
  return o;
}

function generateOrderNumber() {
  const d = new Date();
  const ds = d.getFullYear().toString() +
    String(d.getMonth()+1).padStart(2,'0') +
    String(d.getDate()).padStart(2,'0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CMD-${ds}-${rand}`;
}

function calculateOrderTotals(subtotal, paymentType) {
  if (paymentType === 'deposit') {
    const deposit = Math.max(subtotal * 0.2, 500);
    return { totalPrice: subtotal, depositAmount: deposit, monthlyAmount: null, monthlyDuration: null, discountAmount: 0 };
  }
  if (paymentType === 'monthly') {
    const duration = 60;
    const r = 0.06 / 12;
    const monthly = subtotal * (r * Math.pow(1+r, duration)) / (Math.pow(1+r, duration) - 1);
    return { totalPrice: subtotal, depositAmount: null, monthlyAmount: Math.round(monthly*100)/100, monthlyDuration: duration, discountAmount: 0 };
  }
  return { totalPrice: subtotal, depositAmount: null, monthlyAmount: null, monthlyDuration: null, discountAmount: 0 };
}

// ── AUTH API ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register: async (d) => {
    const { username, email, password, firstName, lastName, phone, monthlySalary } = d;
    if (!username || !email || !password || !firstName || !lastName) err('Champs obligatoires manquants');
    if (password.length < 8) err('Mot de passe trop court (min. 8 caractères)');

    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, firstName, lastName } },
    });
    if (authErr) {
      if (authErr.message?.includes('already registered')) err('Email déjà utilisé');
      err(authErr.message || 'Erreur d\'inscription');
    }
    if (!authData.user) err('Erreur d\'inscription');

    const { error: profileErr } = await supabase.from('profiles').insert({
      id: authData.user.id,
      email,
      username,
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      monthly_salary: monthlySalary ? parseFloat(monthlySalary) : null,
      role: 'CLIENT',
      email_verified: true,
    });
    if (profileErr) {
      if (profileErr.code === '23505') err('Nom d\'utilisateur déjà pris');
      err(profileErr.message || 'Erreur profil');
    }

    const profile = await getUserProfile(authData.user.id);
    const token = authData.session?.access_token || '';
    return ok({ message: 'Compte créé avec succès', token, user: mapProfile(profile) });
  },

  login: async (d) => {
    const { email, password } = d;
    if (!email || !password) err('Email et mot de passe requis');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message?.includes('Invalid login')) err('Email ou mot de passe incorrect');
      err(error.message || 'Erreur de connexion');
    }

    const profile = await getUserProfile(data.user.id);
    return ok({ message: 'Connexion réussie', token: data.session.access_token, user: mapProfile(profile) });
  },

  getMe: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) err('Non authentifié');
    const profile = await getUserProfile(session.user.id);
    return ok({ user: mapProfile(profile) });
  },
};

// ── CAR API ───────────────────────────────────────────────────────────────────
export const carAPI = {
  getAll: async (p = {}) => {
    let q = supabase.from('cars').select('*', { count: 'exact' }).eq('is_active', true);
    if (p.category) q = q.eq('category', p.category);
    if (p.brand) q = q.ilike('make', `%${p.brand}%`);
    if (p.search) q = q.or(`make.ilike.%${p.search}%,model.ilike.%${p.search}%,description.ilike.%${p.search}%`);
    if (p.featured === 'true') q = q.eq('featured', true);
    if (p.promotional === 'true') q = q.eq('promotional', true);
    if (p.campingCar === 'true') q = q.ilike('model', '%camping car%');
    if (p.limit) q = q.limit(parseInt(p.limit));
    if (p.page && p.limit) {
      const from = (parseInt(p.page) - 1) * parseInt(p.limit);
      q = q.range(from, from + parseInt(p.limit) - 1);
    }
    q = q.order('created_at', { ascending: false });
    const { data, error, count } = await q;
    if (error) err(error.message);
    return ok({ cars: (data||[]).map(mapCar), total: count || 0 });
  },

  getById: async (id) => {
    const { data, error } = await supabase.from('cars').select('*').eq('id', id).single();
    if (error || !data) err('Voiture non trouvée');
    return ok({ car: mapCar(data) });
  },

  getCategories: async () => {
    const cats = ['SUV','Berline','Citadine','Coupe','Break','Monospace','Utilitaire','4x4'];
    const { data } = await supabase.from('cars').select('category').eq('is_active', true);
    const counts = {};
    cats.forEach(c => counts[c] = 0);
    (data||[]).forEach(r => { if (counts[r.category] !== undefined) counts[r.category]++; });
    return ok({ categories: cats.map(c => ({ category: c, _count: { category: counts[c] } })) });
  },

  getBrands: async () => {
    const { data } = await supabase.from('cars').select('make').eq('is_active', true);
    const brands = [...new Set((data||[]).map(r => r.make).filter(Boolean))].sort();
    return ok({ brands });
  },

  create: async (formData) => {
    const d = {};
    for (const [k, v] of formData.entries()) {
      if (k !== 'images') d[k] = v;
    }
    const carData = unmapCar(d);

    const files = formData.getAll('images');
    if (files.length > 0) {
      for (let i = 0; i < files.length && i < 20; i++) {
        const file = files[i];
        const fieldName = i === 0 ? 'image_url' : `image_url_${i+1}`;
        const path = `cars/${Date.now()}_${i}_${file.name}`;
        const { error } = await supabase.storage.from('cars').upload(path, file);
        if (!error) {
          const { data: urlData } = supabase.storage.from('cars').getPublicUrl(path);
          carData[fieldName] = urlData.publicUrl;
        }
      }
    }

    const { data, error } = await supabase.from('cars').insert(carData).select().single();
    if (error) err(error.message);
    return ok({ car: mapCar(data) });
  },

  update: async (id, formData) => {
    const d = {};
    for (const [k, v] of formData.entries()) {
      if (k !== 'images' && k !== 'existingImages') d[k] = v;
    }
    const carData = unmapCar(d);

    const files = formData.getAll('images');
    if (files.length > 0) {
      for (let i = 0; i < files.length && i < 20; i++) {
        const file = files[i];
        const fieldName = i === 0 ? 'image_url' : `image_url_${i+1}`;
        const path = `cars/${Date.now()}_${i}_${file.name}`;
        const { error } = await supabase.storage.from('cars').upload(path, file);
        if (!error) {
          const { data: urlData } = supabase.storage.from('cars').getPublicUrl(path);
          carData[fieldName] = urlData.publicUrl;
        }
      }
    }

    const existingImages = formData.getAll('existingImages');
    if (existingImages.length > 0) {
      existingImages.forEach((url, idx) => {
        const fieldName = idx === 0 ? 'image_url' : `image_url_${idx+1}`;
        if (!carData[fieldName]) carData[fieldName] = url;
      });
    }

    const { data, error } = await supabase.from('cars').update(carData).eq('id', id).select().single();
    if (error) err(error.message);
    return ok({ car: mapCar(data) });
  },

  toggle: async (id) => {
    const { data: current } = await supabase.from('cars').select('is_active').eq('id', id).single();
    if (!current) err('Voiture non trouvée');
    const { data, error } = await supabase.from('cars').update({ is_active: !current.is_active }).eq('id', id).select().single();
    if (error) err(error.message);
    return ok({ car: mapCar(data) });
  },

  remove: async (id) => {
    await supabase.from('cart').delete().eq('car_id', id);
    await supabase.from('order_items').delete().eq('car_id', id);
    const { error } = await supabase.from('cars').delete().eq('id', id);
    if (error) err(error.message);
    return ok({ success: true, message: 'Véhicule supprimé' });
  },
};

// ── CART API ──────────────────────────────────────────────────────────────────
async function getFullCart(userId) {
  const { data: items } = await supabase.from('cart').select('*, car:cars(*)').eq('user_id', userId).order('created_at', { ascending: false });
  const cartItems = (items||[]).map(i => ({
    id: i.id,
    quantity: i.quantity,
    carId: i.car_id,
    paymentType: i.payment_type,
    car: mapCar(i.car),
  }));
  const total = cartItems.reduce((s, i) => s + (i.car?.price || 0) * i.quantity, 0);
  return { cartItems, total, count: cartItems.length };
}

async function getCurrentUserId() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) err('Non authentifié');
  return session.user.id;
}

export const cartAPI = {
  get: async () => {
    const userId = await getCurrentUserId();
    return ok(await getFullCart(userId));
  },
  count: async () => {
    const userId = await getCurrentUserId();
    const { count } = await supabase.from('cart').select('*', { count: 'exact', head: true }).eq('user_id', userId);
    return ok({ count: count || 0 });
  },
  add: async (d) => {
    const userId = await getCurrentUserId();
    const { carId, quantity = 1, paymentType = 'full' } = d;

    const { data: car } = await supabase.from('cars').select('*').eq('id', carId).single();
    if (!car || !car.is_active) err('Voiture non trouvée');
    if (car.stock < quantity) err('Stock insuffisant');

    const { data: existing } = await supabase.from('cart').select('*').eq('user_id', userId).eq('car_id', carId).maybeSingle();
    if (existing) {
      const newQty = existing.quantity + quantity;
      if (car.stock < newQty) err('Stock insuffisant');
      await supabase.from('cart').update({ quantity: newQty, payment_type: paymentType }).eq('id', existing.id);
    } else {
      await supabase.from('cart').insert({ user_id: userId, car_id: carId, quantity, payment_type: paymentType });
    }
    return ok(await getFullCart(userId));
  },
  remove: async (carId) => {
    const userId = await getCurrentUserId();
    await supabase.from('cart').delete().eq('user_id', userId).eq('car_id', carId);
    const { count } = await supabase.from('cart').select('*', { count: 'exact', head: true }).eq('user_id', userId);
    return ok({ success: true, cartCount: count || 0 });
  },
};

// ── ORDER API ─────────────────────────────────────────────────────────────────
export const orderAPI = {
  create: async (d) => {
    const userId = await getCurrentUserId();
    const { paymentType, shippingAddress, notes } = d;
    if (!['full','deposit','monthly'].includes(paymentType)) err('Type de paiement invalide');
    if (!shippingAddress?.trim()) err('Adresse de livraison requise');

    const { data: cartItems } = await supabase.from('cart').select('*, car:cars(*)').eq('user_id', userId);
    if (!cartItems || cartItems.length === 0) err('Panier vide');

    for (const item of cartItems) {
      if ((item.car?.stock || 0) < item.quantity) err(`Stock insuffisant : ${item.car?.make} ${item.car?.model}`);
    }

    const subtotal = cartItems.reduce((s, i) => s + (i.car?.price || 0) * i.quantity, 0);
    const totals = calculateOrderTotals(subtotal, paymentType);

    let orderNumber, exists = true;
    while (exists) {
      orderNumber = generateOrderNumber();
      const { data: check } = await supabase.from('orders').select('id').eq('order_number', orderNumber).maybeSingle();
      exists = !!check;
    }

    const { data: order, error: orderErr } = await supabase.from('orders').insert({
      order_number: orderNumber,
      user_id: userId,
      payment_type: paymentType,
      shipping_address: shippingAddress,
      notes: notes || null,
      ...totals,
    }).select().single();
    if (orderErr) err(orderErr.message);

    const itemsData = cartItems.map(i => ({
      order_id: order.id,
      car_id: i.car_id,
      quantity: i.quantity,
      unit_price: i.car.price,
    }));
    await supabase.from('order_items').insert(itemsData);

    for (const item of cartItems) {
      await supabase.rpc('decrement_stock', { car_id: item.car_id, qty: item.quantity }).or(
        // Fallback if RPC doesn't exist
        await supabase.from('cars').update({ stock: (item.car.stock - item.quantity) }).eq('id', item.car_id)
      );
    }

    await supabase.from('order_tracking').insert({ order_id: order.id, status: 'pending', comment: 'Commande reçue' });
    await supabase.from('cart').delete().eq('user_id', userId);

    return ok({ success: true, orderNumber: order.order_number, order: { ...order, orderNumber: order.order_number } });
  },

  getMy: async () => {
    const userId = await getCurrentUserId();
    const { data } = await supabase.from('orders')
      .select('*, items:order_items(*, car:cars(*)), tracking:order_tracking(*)')
      .eq('user_id', userId).order('created_at', { ascending: false });
    return ok((data||[]).map(o => ({ ...o, orderNumber: o.order_number, paymentType: o.payment_type, totalPrice: o.total_price, shippingAddress: o.shipping_address })));
  },

  getByNumber: async (num) => {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase.from('orders')
      .select('*, user:profiles(firstName:first_name, lastName:last_name, email), items:order_items(*, car:cars(*)), tracking:order_tracking(*, admin:profiles(firstName:first_name, lastName:last_name))')
      .eq('order_number', num).eq('user_id', userId).single();
    if (error || !data) err('Commande non trouvée');
    return ok({ order: { ...data, orderNumber: data.order_number, paymentType: data.payment_type, totalPrice: data.total_price, shippingAddress: data.shipping_address } });
  },

  track: async (num) => {
    const { data, error } = await supabase.from('orders')
      .select('*, items:order_items(*, car:cars(*)), tracking:order_tracking(*, admin:profiles(firstName:first_name, lastName:last_name))')
      .eq('order_number', num).single();
    if (error || !data) err('Commande non trouvée');
    return ok({ order: { ...data, orderNumber: data.order_number, paymentType: data.payment_type, totalPrice: data.total_price, shippingAddress: data.shipping_address } });
  },

  getAll: async (p = {}) => {
    const userId = await getCurrentUserId();
    const { data: me } = await supabase.from('profiles').select('role').eq('id', userId).single();
    if (me?.role !== 'ADMIN') {
      return orderAPI.getMy();
    }

    let q = supabase.from('orders').select('*, user:profiles(firstName:first_name, lastName:last_name, email), items:order_items(*, car:cars(*))', { count: 'exact' });
    if (p.status) q = q.eq('status', p.status);
    q = q.order('created_at', { ascending: false });
    if (p.limit) {
      const limit = parseInt(p.limit);
      const page = parseInt(p.page) || 1;
      q = q.range((page-1)*limit, page*limit-1);
    }
    const { data, error, count } = await q;
    if (error) err(error.message);

    const { data: statusData } = await supabase.from('orders').select('status');
    const statusCounts = {};
    (statusData||[]).forEach(o => { statusCounts[o.status] = (statusCounts[o.status]||0) + 1; });

    return ok({
      orders: (data||[]).map(o => ({ ...o, orderNumber: o.order_number, paymentType: o.payment_type, totalPrice: o.total_price, shippingAddress: o.shipping_address })),
      total: count || 0,
      statusCounts: Object.entries(statusCounts).map(([status, _count]) => ({ status, _count })),
    });
  },

  getAdminDetail: async (id) => {
    const { data, error } = await supabase.from('orders')
      .select('*, user:profiles(firstName:first_name, lastName:last_name, email), items:order_items(*, car:cars(*)), tracking:order_tracking(*, admin:profiles(firstName:first_name, lastName:last_name))')
      .eq('id', id).single();
    if (error || !data) err('Commande non trouvée');
    return ok({ order: { ...data, orderNumber: data.order_number, paymentType: data.payment_type, totalPrice: data.total_price, shippingAddress: data.shipping_address } });
  },

  updateStatus: async (id, d) => {
    const { status, comment } = d;
    const validStatuses = ['pending','confirmed','processing','shipped','delivered','cancelled'];
    if (!validStatuses.includes(status)) err('Statut invalide');

    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) err(error.message);

    await supabase.from('order_tracking').insert({
      order_id: parseInt(id), status, comment: comment || null,
      updated_by: session?.user?.id || null,
    });

    return ok({ success: true });
  },
};

// ── SIMULATION API ────────────────────────────────────────────────────────────
export const simAPI = {
  simulate: async (salary) => {
    const s = parseFloat(salary);
    if (!s || s <= 0) err('Salaire invalide');
    const maxMonthly = s * 0.3;
    const r = 0.06 / 12;
    const months = 60;
    const factor = (Math.pow(1+r, months)-1) / (r * Math.pow(1+r, months));
    const maxPrice = maxMonthly * factor;

    const { data } = await supabase.from('cars').select('*').eq('is_active', true).lte('price', maxPrice).order('price', { ascending: false });
    return ok({ count: (data||[]).length, salary: s, maxMonthly, cars: (data||[]).map(mapCar) });
  },
};

// ── ADMIN API ─────────────────────────────────────────────────────────────────
export const adminAPI = {
  stats: async () => {
    const [{ count: totalClients }, { count: totalCars }, ordersRes] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('cars').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('orders').select('total_price, status, created_at, user:profiles(firstName:first_name, lastName:last_name), items:order_items(car:cars(make, model))').order('created_at', { ascending: false }).limit(5),
    ]);

    const { data: allOrders } = await supabase.from('orders').select('total_price, status');
    const totalRevenue = (allOrders||[]).reduce((s, o) => s + (o.total_price || 0), 0);
    const pendingOrders = (allOrders||[]).filter(o => o.status === 'pending').length;

    return ok({
      totalClients: totalClients || 0,
      totalCars: totalCars || 0,
      totalOrders: (allOrders||[]).length,
      totalRevenue,
      pendingOrders,
      recentOrders: (ordersRes.data||[]).map(o => ({ ...o, totalPrice: o.total_price })),
    });
  },

  clients: async (p = {}) => {
    let q = supabase.from('profiles').select('*, _count:orders(*)', { count: 'exact' }).eq('role', 'CLIENT');
    if (p.search) {
      q = q.or(`first_name.ilike.%${p.search}%,last_name.ilike.%${p.search}%,email.ilike.%${p.search}%,username.ilike.%${p.search}%`);
    }
    q = q.order('created_at', { ascending: false });
    if (p.limit) {
      const limit = parseInt(p.limit);
      const page = parseInt(p.page) || 1;
      q = q.range((page-1)*limit, page*limit-1);
    }
    const { data, error, count } = await q;
    if (error) err(error.message);
    return ok({
      clients: (data||[]).map(c => ({ ...c, firstName: c.first_name, lastName: c.last_name, monthlySalary: c.monthly_salary })),
      total: count || 0,
      page: parseInt(p.page) || 1,
      limit: parseInt(p.limit) || 20,
    });
  },

  getCars: async () => {
    const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
    if (error) err(error.message);
    return ok({ cars: (data||[]).map(mapCar), total: (data||[]).length });
  },
};

// ── USER API ──────────────────────────────────────────────────────────────────
export const userAPI = {
  updateProfile: async (d) => {
    const userId = await getCurrentUserId();
    const { firstName, lastName, phone, address, monthlySalary } = d;
    const { error } = await supabase.from('profiles').update({
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      address: address || null,
      monthly_salary: monthlySalary ? parseFloat(monthlySalary) : null,
    }).eq('id', userId);
    if (error) err(error.message);
    const profile = await getUserProfile(userId);
    return ok({ message: 'Profil mis à jour', user: mapProfile(profile) });
  },

  changePassword: async (d) => {
    const { currentPassword, newPassword } = d;
    if (!currentPassword || !newPassword) err('Mot de passe actuel et nouveau requis');
    if (newPassword.length < 8) err('Nouveau mot de passe trop court (min. 8 caractères)');

    const { data: { session } } = await supabase.auth.getSession();
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: session.user.email,
      password: currentPassword,
    });
    if (signInErr) err('Mot de passe actuel incorrect');

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) err(error.message);
    return ok({ message: 'Mot de passe mis à jour' });
  },
};

export default { authAPI, carAPI, cartAPI, orderAPI, simAPI, adminAPI, userAPI };
