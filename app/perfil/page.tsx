'use client';

import React, { useState, useEffect } from 'react';
import { getVagasByCandidate } from '@/src/lib/api/vaga/getVagasByCandidate';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';

export default function PerfilPage() {
  const router = useRouter();
  const { user, isAuthenticated, userType, isLoading, logout } = useAuth();
  const [minhasCandidaturas, setMinhasCandidaturas] = useState<any[]>([]);
  const [loadingCandidaturas, setLoadingCandidaturas] = useState(false);
  const [showCandidaturas, setShowCandidaturas] = useState(false);

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // lazy-load das candidaturas: carregadas quando o usuário clicar no botão
  const loadCandidaturas = async () => {
    if (userType !== 'candidate' || !user) return;
    try {
      setLoadingCandidaturas(true);
      console.log('[perfil] carregando candidaturas para user.id=', user.id);
      const resp = await getVagasByCandidate(user.id);
      console.log('[perfil] resposta do getVagasByCandidate:', resp);

      // Normalizar formatos de resposta possíveis:
      // - { success, message: '...', data: [...] }
      // - { message: [...]} ou [...]
      let arr: any[] = [];
      if (Array.isArray(resp)) {
        arr = resp;
      } else if (resp && Array.isArray(resp.data)) {
        arr = resp.data;
      } else if (resp && resp.message && Array.isArray(resp.message)) {
        arr = resp.message;
      } else if (resp && resp.message && resp.message.data && Array.isArray(resp.message.data)) {
        arr = resp.message.data;
      } else {
        arr = [];
      }

      setMinhasCandidaturas(arr);
    } catch (e) {
      console.error('Erro ao carregar candidaturas:', e);
      alert('Erro ao carregar candidaturas. Veja console para detalhes.');
      setMinhasCandidaturas([]);
    } finally {
      setLoadingCandidaturas(false);
    }
  };

  const toggleCandidaturas = async () => {
    if (!showCandidaturas && minhasCandidaturas.length === 0) {
      await loadCandidaturas();
    }
    setShowCandidaturas((s) => !s);
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Cores baseadas no tipo de usuário
  const primaryColor = userType === 'candidate' ? '#7BB7EB' : '#ECAE7D';
  const gradientFrom = userType === 'candidate' ? 'from-blue-50' : 'from-orange-50';
  const gradientTo = userType === 'candidate' ? 'to-sky-50' : 'to-amber-50';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientFrom} via-gray-50 ${gradientTo}`}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: primaryColor}}>
                <span className="text-white font-bold text-xl">PC</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">PCDentro</span>
            </a>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push(userType === 'candidate' ? '/vaga' : '/vaga/create')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition"
              >
                Início
              </button>
              <button
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition"
              >
                Sair
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header do Perfil */}
          <div className="px-8 py-10" style={{background: `linear-gradient(135deg, ${primaryColor} 0%, #52606B 100%)`}}>
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl font-bold" style={{color: primaryColor}}>
                {userType === 'candidate' && user && 'name' in user ? user.name.charAt(0).toUpperCase() : 
                 userType === 'company' && user && 'trade_name' in user ? user.trade_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {userType === 'candidate' && user && 'name' in user ? user.name : 
                   userType === 'company' && user && 'trade_name' in user ? user.trade_name : 'Usuário'}
                </h1>
                <p className="text-white opacity-90 text-lg">
                  {userType === 'candidate' ? 'Candidato' : 'Empresa'}
                </p>
              </div>
              <button
                onClick={() => router.push('/mudar-senha')}
                className="px-6 py-3 bg-white rounded-lg font-semibold hover:opacity-90 transition shadow-lg"
                style={{color: primaryColor}}
              >
                Alterar Senha
              </button>
            </div>
          </div>

          {/* Dados do Perfil - CANDIDATO */}
          {userType === 'candidate' && user && 'name' in user && (
            <div className="p-8 md:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações Pessoais</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">{user.name}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CPF</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">{'cpf' in user ? user.cpf : '-'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">{'phone' in user ? user.phone : '-'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Data de Nascimento</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">
                      {'birth_date' in user ? new Date(user.birth_date).toLocaleDateString('pt-BR') : '-'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ID do Usuário</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-mono text-sm">{user.id}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Minhas Candidaturas (CANDIDATO) - lazy-load by button */}
          {userType === 'candidate' && showCandidaturas && (
            <div className="p-8 md:p-10 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Minhas Candidaturas</h2>

              {loadingCandidaturas ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-3 text-gray-600">Carregando candidaturas...</p>
                </div>
              ) : minhasCandidaturas.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                  <p className="text-gray-600">Você ainda não se candidatou a nenhuma vaga.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {minhasCandidaturas.map((v: any, idx: number) => (
                    <div key={v.id && v.id !== user?.id ? v.id : `cand-${idx}`} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-900">{v.titulo || v.vaga_titulo || 'Vaga'}</h3>
                        <p className="text-sm text-gray-600">{v.nome_fantasia || v.empresa || ''}</p>
                        <p className="text-xs text-gray-500">Publicada: {v.data_inicio ? new Date(v.data_inicio).toLocaleDateString('pt-BR') : '-'}</p>
                        <p className="text-xs text-gray-500">Até: {v.data_fim ? new Date(v.data_fim).toLocaleDateString('pt-BR') : '-'}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>{v.status ? 'Candidatura ativa' : 'Candidatura processada'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Dados do Perfil - EMPRESA */}
          {userType === 'company' && user && 'trade_name' in user && (
            <div className="p-8 md:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações da Empresa</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Fantasia</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">{user.trade_name}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Razão Social</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">{user.company_name}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CNPJ</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">{user.cnpj}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">{user.phone}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ID da Empresa</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-mono text-sm">{user.id}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="px-8 pb-8 md:px-10 md:pb-10">
            <div className="pt-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => router.push('/mudar-senha')}
                className="px-6 py-3 border-2 rounded-lg font-semibold hover:opacity-80 transition"
                style={{borderColor: primaryColor, color: primaryColor}}
              >
                Alterar Senha
              </button>
              <button
                onClick={() => router.push('/perfil/editar')}
                className="px-6 py-3 border-2 rounded-lg font-semibold hover:opacity-80 transition"
                style={{borderColor: primaryColor, color: primaryColor}}
              >
                Editar Perfil
              </button>
              {userType === 'company' && (
                <button
                  onClick={() => router.push('/minhas-vagas')}
                  className="px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition shadow-lg"
                  style={{backgroundColor: primaryColor}}
                >
                  Minhas Vagas
                </button>
              )}
              {userType === 'candidate' && (
                <button
                  onClick={toggleCandidaturas}
                  className="px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition shadow-lg"
                  style={{backgroundColor: primaryColor}}
                >
                  Minhas Candidaturas
                </button>
              )}
              <button
                onClick={() => router.push(userType === 'candidate' ? '/vaga' : '/vaga/create')}
                className="px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition shadow-lg"
                style={{backgroundColor: primaryColor}}
              >
                {userType === 'candidate' ? 'Ver Vagas' : 'Criar Vaga'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
