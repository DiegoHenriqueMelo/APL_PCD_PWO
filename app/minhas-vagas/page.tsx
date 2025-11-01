'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { getVagasByCompany } from '@/src/lib/api/vaga/getVagasByCompany';
import { deleteVaga } from '@/src/lib/api/vaga/deleteVaga';

interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
  salario: string;
  data_inicio: string;
  data_fim: string;
  status: boolean;
}

export default function MinhasVagasPage() {
  const router = useRouter();
  const { user, isAuthenticated, userType, isLoading } = useAuth();
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (userType !== 'company') {
      router.push('/perfil');
      return;
    }

    if (user?.id) {
      loadVagas();
    }
  }, [user, isAuthenticated, userType, isLoading, router]);

  const loadVagas = async () => {
    try {
      if (!user?.id) {
        console.log('⚠️ User ID não encontrado');
        return;
      }
      
      console.log('📞 Buscando vagas para empresa:', user.id);
      const response = await getVagasByCompany(user.id);
      console.log('📦 Resposta completa:', response);
      
      // Backend retorna: { message: { success: true, message: "...", data: [...] } }
      const vagasData = response?.message?.data || [];
      console.log('✅ Vagas processadas:', vagasData);
      console.log('✅ Quantidade:', vagasData.length);
      
      setVagas(Array.isArray(vagasData) ? vagasData : []);
    } catch (error) {
      console.error('❌ Erro ao carregar vagas:', error);
      setVagas([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || isLoading || userType !== 'company') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const primaryColor = '#ECAE7D';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-gray-50 to-amber-50">
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
                onClick={() => router.push('/perfil')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition"
              >
                Perfil
              </button>
              <button
                onClick={() => router.push('/vaga/create')}
                className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition"
                style={{backgroundColor: primaryColor}}
              >
                + Nova Vaga
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Minhas Vagas</h1>
          <p className="text-gray-600">Gerencie as vagas criadas pela sua empresa</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando vagas...</p>
          </div>
        ) : vagas.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma vaga criada</h3>
            <p className="text-gray-600 mb-6">Crie sua primeira vaga para começar a atrair candidatos!</p>
            <button
              onClick={() => router.push('/vaga/create')}
              className="px-8 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition shadow-lg"
              style={{backgroundColor: primaryColor}}
            >
              Criar Primeira Vaga
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vagas.map((vaga) => (
              <div key={vaga.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{vaga.titulo}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      vaga.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {vaga.status ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{vaga.descricao}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">R$ {vaga.salario}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Até {new Date(vaga.data_fim).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">


                    <button
                      onClick={async () => {
                        const ok = confirm('Deseja desativar esta vaga? Essa ação pode ser reversível no backend.');
                        if (!ok) return;
                        try {
                          await deleteVaga(vaga.id);
                          // recarregar lista
                          await loadVagas();
                        } catch (e) {
                          console.error('Erro ao desativar vaga:', e);
                          alert('Erro ao desativar vaga. Veja o console para mais detalhes.');
                        }
                      }}
                      className="px-4 py-2 rounded-lg font-semibold text-red-700 border border-red-200 hover:bg-red-50 transition"
                    >
                      Desativar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
