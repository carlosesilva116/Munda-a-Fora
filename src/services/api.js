
import { requireBackend } from './supabase';

const client = () => requireBackend();

const unwrap = ({ data, error }) => {
  if (error) throw error;
  return data;
};

// ==========================================
// AUTENTICAÇÃO
// ==========================================

export const authApi = {
  async signUp(user) {
    const sb = client();

    const { data, error } = await sb.auth.signUp({
      email: user.email.trim().toLowerCase(),
      password: user.password,
      options: {
        data: {
          name: user.name,
          kind: user.kind,
          company_name: user.companyName || '',
          company_country: user.companyCountry || '',
          origin_country: user.originCountry || '',
          company_id: user.companyId || '',
        },
      },
    });

    if (error) throw error;

    if (data.user && data.session) {
      await profileApi.upsertFromAuth(data.user, user);
    }

    return {
      ...user,
      id: data.user?.id,
      email: data.user?.email,
      name: user.name,
    };
  },

  async signIn(email, password) {
    const sb = client();

    const { data, error } = await sb.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) throw error;

    let profile = await profileApi.getMine();

    if (!profile) {
      profile = await profileApi.upsertFromAuth(
        data.user,
        data.user.user_metadata || {}
      );
    }

    return {
      ...profile,
      id: data.user.id,
      email: data.user.email,
    };
  },

  async signOut() {
    const { error } = await client().auth.signOut();
    if (error) throw error;
  },

  async session() {
    const { data, error } = await client().auth.getSession();
    if (error) throw error;
    return data.session;
  },
};

// ==========================================
// PERFIS
// ==========================================

export const profileApi = {
  async upsertFromAuth(user, values = {}) {
    const payload = {
      id: user.id,
      email: user.email,
      name: values.name || user.user_metadata?.name || 'Usuário',
      kind:
        values.kind ||
        user.user_metadata?.kind ||
        'Planejando a mudança',
      company_name:
        values.companyName ||
        user.user_metadata?.company_name ||
        '',
      company_country:
        values.companyCountry ||
        user.user_metadata?.company_country ||
        '',
      origin_country:
        values.originCountry ||
        user.user_metadata?.origin_country ||
        '',
      company_id:
        values.companyId ||
        user.user_metadata?.company_id ||
        '',
    };

    const { data, error } = await client()
      .from('profiles')
      .upsert(payload)
      .select()
      .single();

    if (error) throw error;

    return mapProfile(data);
  },

  async getMine() {
    const {
      data: { user },
    } = await client().auth.getUser();

    if (!user) return null;

    const { data, error } = await client()
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;

    return data ? mapProfile(data) : null;
  },

  async update(values) {
    const payload = {
      name: values.name,
      kind: values.kind,
      location: values.location || '',
      destination: values.destination || '',
      languages: values.languages || '',
      bio: values.bio || '',
      company_name: values.companyName || '',
      company_country: values.companyCountry || '',
      origin_country: values.originCountry || '',
      company_id: values.companyId || '',
      industry: values.industry || '',
      website: values.website || '',
      company_bio: values.companyBio || '',
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await client()
      .from('profiles')
      .update(payload)
      .select()
      .single();

    if (error) throw error;

    return mapProfile(data);
  },
};

function mapProfile(p) {
  return {
    id: p.id,
    email: p.email,
    name: p.name,
    kind: p.kind,
    location: p.location,
    destination: p.destination,
    languages: p.languages,
    bio: p.bio,
    companyName: p.company_name,
    companyCountry: p.company_country,
    originCountry: p.origin_country,
    companyId: p.company_id,
    industry: p.industry,
    website: p.website,
    companyBio: p.company_bio,
  };
}

// ==========================================
// PROJETOS E INSCRIÇÕES
// ==========================================

export const projectsApi = {
  async list({ mine = false } = {}) {
    let q = client()
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (mine) {
      const {
        data: { user },
      } = await client().auth.getUser();

      if (!user) {
        throw new Error('Entre na sua conta para visualizar seus projetos.');
      }

      q = q.eq('owner_id', user.id);
    }

    const { data, error } = await q;

    if (error) throw error;

    return (data || []).map((p) => ({
      ...p,
      id: p.id,
      companyName: p.company_name,
      createdAt: p.created_at,
      vacancies: String(p.vacancies),
    }));
  },

  async create(p) {
    const {
      data: { user },
    } = await client().auth.getUser();

    if (!user) {
      throw new Error('Entre na sua conta para publicar projetos.');
    }

    const payload = {
      owner_id: user.id,
      company_name: p.companyName,
      service: p.service,
      vacancies: Number(p.vacancies),
      title: p.title,
      description: p.description,
      requirements: p.requirements || '',
      benefits: p.benefits || '',
      contact: p.contact || '',
      city: p.city,
      state: p.state,
      country: p.country,
      status: 'published',
    };

    const { data, error } = await client()
      .from('projects')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      id: data.id,
      createdAt: data.created_at,
      vacancies: String(data.vacancies),
    };
  },

  async update(id, patch) {
    const { data, error } = await client()
      .from('projects')
      .update({
        title: patch.title,
        description: patch.description,
        service: patch.service,
        vacancies: Number(patch.vacancies),
        requirements: patch.requirements,
        benefits: patch.benefits,
        contact: patch.contact,
        city: patch.city,
        state: patch.state,
        country: patch.country,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async remove(id) {
    const { error } = await client()
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async apply(projectId, message = '') {
    const sb = client();

    const {
      data: { user },
      error: authError,
    } = await sb.auth.getUser();

    if (authError) throw authError;

    if (!user) {
      throw new Error('Entre na sua conta para se inscrever.');
    }

    const { data: existing, error: findError } = await sb
      .from('project_applications')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (findError) throw findError;

    if (existing?.status === 'accepted') {
      throw new Error('Sua inscrição já foi aceita.');
    }

    if (
      existing?.status === 'pending' ||
      existing?.status === 'reviewing'
    ) {
      throw new Error('Você já possui uma inscrição neste projeto.');
    }

    if (existing) {
      const { data, error } = await sb
        .from('project_applications')
        .update({
          message,
          status: 'pending',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;

      return data;
    }

    const { data, error } = await sb
      .from('project_applications')
      .insert({
        project_id: projectId,
        user_id: user.id,
        message,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async applications(projectId) {
    const { data, error } = await client()
      .from('project_applications')
      .select('*, profiles:user_id(name,email)')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data;
  },

  async myApplications() {
    const {
      data: { user },
    } = await client().auth.getUser();

    if (!user) {
      throw new Error('Entre na sua conta para visualizar suas inscrições.');
    }

    const { data, error } = await client()
      .from('project_applications')
      .select('*, projects(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data;
  },

  async reviewApplication(id, status) {
    const { data, error } = await client()
      .from('project_applications')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};

// ==========================================
// CONVERSAS E MENSAGENS
// ==========================================


export const chatsApi = {
  async create(title, memberIds = []) {
    const { data: { user } } = await client().auth.getUser();

    if (!user) {
      throw new Error('Entre na sua conta para criar uma conversa.');
    }

    const { data: chat, error } = await client()
      .from('chats')
      .insert({
        title,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    const ids = [...new Set([user.id, ...memberIds])];

    const { error: memberError } = await client()
      .from('chat_members')
      .insert(
        ids.map(user_id => ({
          chat_id: chat.id,
          user_id,
        }))
      );

    if (memberError) throw memberError;

    return chat;
  },

  async openDirect(otherUserId, title) {
    const { data: { user } } = await client().auth.getUser();

    if (!user) throw new Error('Usuário não autenticado.');

    if (user.id === otherUserId) {
      throw new Error('Não é possível conversar consigo mesmo.');
    }

    const { data: mine, error: mineError } = await client()
      .from('chat_members')
      .select('chat_id')
      .eq('user_id', user.id);

    if (mineError) throw mineError;

    const ids = (mine || []).map(item => item.chat_id);

    if (ids.length) {
      const { data: shared, error } = await client()
        .from('chat_members')
        .select('chat_id')
        .eq('user_id', otherUserId)
        .in('chat_id', ids);

      if (error) throw error;

      if (shared?.length) {
        const { data, error: chatError } = await client()
          .from('chats')
          .select('*')
          .eq('id', shared[0].chat_id)
          .single();

        if (chatError) throw chatError;

        return data;
      }
    }

    return this.create(title, [otherUserId]);
  },

  async list() {
    const { data: { user } } = await client().auth.getUser();

    if (!user) throw new Error('Usuário não autenticado.');

    const { data, error } = await client()
      .from('chat_members')
      .select('chat:chats(id,title,created_by,created_at)')
      .eq('user_id', user.id)
      .order('joined_at', { ascending: false });

    if (error) throw error;

    return (data || [])
      .map(item => item.chat)
      .filter(Boolean);
  },

  async otherMember(chatId) {
    const { data: { user } } = await client().auth.getUser();

    if (!user) throw new Error('Usuário não autenticado.');

    const { data: member, error: memberError } = await client()
      .from('chat_members')
      .select('user_id')
      .eq('chat_id', chatId)
      .neq('user_id', user.id)
      .maybeSingle();

    if (memberError) throw memberError;

    if (!member) return null;

    const { data: profile, error: profileError } = await client()
      .from('profiles')
      .select('id,name,kind,location,destination')
      .eq('id', member.user_id)
      .maybeSingle();

    if (profileError) throw profileError;

    return profile;
  },

  async messages(chatId) {
    const { data, error } = await client()
      .from('messages')
      .select('*, profiles:sender_id(name)')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data || [];
  },

  async send(chatId, body) {
    const { data: { user } } = await client().auth.getUser();

    if (!user) throw new Error('Usuário não autenticado.');

    const { data, error } = await client()
      .from('messages')
      .insert({
        chat_id: chatId,
        sender_id: user.id,
        body: body.trim(),
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async deleteMessage(messageId) {
    const { error } = await client()
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;
  },
};


// ==========================================
// DIRETÓRIO DE RESIDENTES
// ==========================================

export const residentsApi = {
  async list() {
    const { data, error } = await client()
      .from('profiles')
      .select('id,name,location,destination,languages,bio,kind')
      .eq('kind', 'Residente no exterior')
      .order('name');

    if (error) throw error;

    return (data || []).map((profile) => ({
      id: profile.id,
      name: profile.name,
      city: profile.location || 'Localização não informada',
      countryId: countryIdFromText(
        profile.destination || profile.location || ''
      ),
      bio: profile.bio || 'Este residente ainda não adicionou uma apresentação.',
      destination: profile.destination || '',
      languages: profile.languages || '',
    }));
  },
};

function countryIdFromText(value) {
  const text = String(value).toLocaleLowerCase('pt-BR');

  const aliases = [
    ['usa', ['estados unidos', 'united states', 'usa', 'eua']],
    ['portugal', ['portugal']],
    ['paraguay', ['paraguai', 'paraguay']],
    ['uk', ['reino unido', 'united kingdom', 'inglaterra', 'uk']],
    ['japan', ['japão', 'japao', 'japan']],
  ];

  return (
    aliases.find(([, names]) =>
      names.some((name) => text.includes(name))
    )?.[0] || 'portugal'
  );
}

// ==========================================
// FAVORITOS
// ==========================================

export const favoritesApi = {
  async list() {
    const { data, error } = await client()
      .from('favorites')
      .select('country_id');

    if (error) throw error;

    return (data || []).map((x) => x.country_id);
  },

  async toggle(countryId) {
    const sb = client();

    const {
      data: { user },
    } = await sb.auth.getUser();

    if (!user) {
      throw new Error('Entre na sua conta para gerenciar favoritos.');
    }

    const { data: existing, error: findError } = await sb
      .from('favorites')
      .select('country_id')
      .eq('user_id', user.id)
      .eq('country_id', String(countryId))
      .maybeSingle();

    if (findError) throw findError;

    if (existing) {
      const { error } = await sb
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('country_id', String(countryId));

      if (error) throw error;

      return false;
    }

    const { error } = await sb
      .from('favorites')
      .insert({
        user_id: user.id,
        country_id: String(countryId),
      });

    if (error) throw error;

    return true;
  },
};

// ==========================================
// ADMINISTRAÇÃO E MODERAÇÃO
// ==========================================

export const managementApi = {
  async projectAnalytics(projectId = null) {
    let q = client()
      .from('project_analytics')
      .select('*');

    if (projectId) {
      q = q.eq('project_id', projectId);
    }

    const { data, error } = await q.order('title');

    if (error) throw error;

    return data || [];
  },

  async setProjectStatus(projectId, status) {
    if (
      !['draft', 'published', 'paused', 'closed', 'archived'].includes(status)
    ) {
      throw new Error('Status de projeto inválido.');
    }

    const { data, error } = await client()
      .from('projects')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async updateChat(chatId, title) {
    const { data, error } = await client()
      .from('chats')
      .update({
        title,
        updated_at: new Date().toISOString(),
      })
      .eq('id', chatId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async deleteChat(chatId) {
    const { error } = await client()
      .from('chats')
      .delete()
      .eq('id', chatId);

    if (error) throw error;
  },

  async leaveChat(chatId) {
    const sb = client();

    const {
      data: { user },
    } = await sb.auth.getUser();

    if (!user) {
      throw new Error('Entre na sua conta para sair da conversa.');
    }

    const { error } = await sb
      .from('chat_members')
      .delete()
      .eq('chat_id', chatId)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  async editMessage(messageId, body) {
    const { data, error } = await client()
      .from('messages')
      .update({
        body,
        edited_at: new Date().toISOString(),
      })
      .eq('id', messageId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async updateApplicationStatus(applicationId, status) {
    if (
      !['reviewing', 'accepted', 'rejected', 'withdrawn'].includes(status)
    ) {
      throw new Error('Status de inscrição inválido.');
    }

    const { data, error } = await client()
      .from('project_applications')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};
