'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getVagas } from '../../src/lib/api/vaga/getVagas';
import { applyVaga } from '../../src/lib/api/vaga/applyVaga';

interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
  salario?: number;
  localidade: string;
  tipo: string;
  acess?: string;
  tipo_acess?: string;
  data_inicio?: string;
  data_fim?: string;
  status?: boolean;
  id_creator?: string;
  nome_fantasia?: string;
}

export default function VagasPage() {
  const router = useRouter();
  const { user, userType, isAuthenticated, isLoading } = useAuth();
  
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  // Estado para popup personalizado
  const [popup, setPopup] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    show: false,
    type: 'success',
    message: '',
  });

  // Função para mostrar popup personalizado
  const showPopup = (type: 'success' | 'error', message: string) => {
    setPopup({ show: true, type, message });
    setTimeout(() => {
      setPopup({ show: false, type, message: '' });
    }, 4000);
  };

  useEffect(() => {
    loadVagas();
  }, [userType, isAuthenticated]);

  const loadVagas = async () => {
    try {
      setLoading(true);
      
      // Se for candidato autenticado, pegar o ID da deficiência do localStorage
      let tipoAcessFilter: string | undefined = undefined;
      if (userType === 'candidate' && isAuthenticated) {
        try {
          // Tentar obter o ID da deficiência do usuário armazenado no localStorage
          const storedUser = localStorage.getItem('@PCDentro:user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            const deficiencia = userData?.deficiencia;
            if (deficiencia) {
              tipoAcessFilter = deficiencia;
              console.log('Filtrando vagas por tipo_acess (deficiencia do localStorage):', tipoAcessFilter);
            }
          }
        } catch (error) {
          console.error('Erro ao buscar deficiência do localStorage:', error);
        }
      }
      
      const data = await getVagas(tipoAcessFilter);
      console.log('Dados recebidos:', data);
      // A API pode retornar em diferentes formatos:
      // {data: [...], total: X, source: 'cache'} ou {message: [...]} ou [...]
      const vagasArray = data?.data || data?.message || data || [];
      // Se for candidato, remover vagas desativadas (status === false)
      const arr = Array.isArray(vagasArray) ? vagasArray : [];
      try {
        if (userType === 'candidate') {
          setVagas(arr.filter((v: any) => v.status));
        } else {
          setVagas(arr);
        }
      } catch (e) {
        setVagas(arr);
      }
    } catch (error) {
      console.error('Erro ao carregar vagas:', error);
      setVagas([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (vaga: Vaga) => {
    // candidatos não devem abrir modal de vagas desativadas
    if (userType === 'candidate' && !vaga.status) {
      alert('Esta vaga está desativada e não está disponível para candidatura.');
      return;
    }

    setSelectedVaga(vaga);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVaga(null);
    document.body.style.overflow = 'unset';
  };

  const handleApplyToVaga = async () => {
    if (!selectedVaga) return;
    if (!selectedVaga.status) {
      showPopup('error', 'Esta vaga está desativada e não pode receber candidaturas.');
      return;
    }
    // apenas candidatos autenticados podem se candidatar
    if (isLoading) return; // espera carregar contexto
    if (!isAuthenticated || userType !== 'candidate' || !user) {
      showPopup('error', 'Apenas candidatos autenticados podem se candidatar. Faça login como candidato.');
      router.push('/login');
      return;
    }

    const candidateId = (user as any).id;

    setIsApplying(true);
    try {
      const applicationData = {
        vaga_id: selectedVaga.id,
        id: candidateId,
      };

      console.log('Aplicando para vaga:', applicationData);
      const response = await applyVaga(applicationData);

      console.log('Resposta da API:', response);
      showPopup('success', 'Candidatura realizada com sucesso!');
      closeModal();
    } catch (error) {
      console.error('Erro ao candidatar-se:', error);
      showPopup('error', 'Erro ao realizar candidatura. Tente novamente.');
    } finally {
      setIsApplying(false);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return 'Recente';
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    if (days < 7) return `${days} dias atrás`;
    if (days < 30) return `${Math.floor(days / 7)} semanas atrás`;
    return `${Math.floor(days / 30)} meses atrás`;
  };

  const formatSalary = (salario?: number) => {
    if (!salario) return null;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(salario);
  };

  const parseAccessibility = (acess?: string) => {
    if (!acess) return [];
    return acess.split(',').map(item => item.trim());
  };

  const getEmpresaName = (vaga: Vaga) => {
    return vaga.nome_fantasia || 'Empresa não informada';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: '#7BB7EB'}}>
                <span className="text-white font-bold text-xl">PC</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">PCDentro</span>
            </a>
            <div className="flex space-x-4">
              <a
                href="/perfil"
                className="px-6 py-2 rounded-lg font-medium text-white hover:opacity-90 transition"
                style={{backgroundColor: '#7BB7EB'}}
              >
                Perfil
              </a>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header do Feed */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Vagas Disponíveis</h1>
          <p className="text-gray-600">
            {vagas.length} {vagas.length === 1 ? 'vaga disponível' : 'vagas disponíveis'}
          </p>
        </div>

        {/* Vagas Feed */}
        <div className="space-y-4">
          {loading ? (
            // Loading skeleton
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : vagas.length === 0 ? (
            // Empty state
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma vaga encontrada</h3>
              <p className="text-gray-600">Não há vagas disponíveis no momento</p>
            </div>
          ) : (
            // Vagas list
            vagas.map((vaga) => (
              <div
                key={vaga.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border-l-4 hover:scale-[1.01]"
                style={{borderLeftColor: '#7BB7EB'}}
                onClick={() => openModal(vaga)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:opacity-80" style={{color: '#52606B'}}>
                      {vaga.titulo}
                    </h3>
                    <div className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{getEmpresaName(vaga)}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{vaga.localidade}</span>
                      </div>
                      {vaga.localidade?.toLowerCase().includes('remoto') && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          🏠 Remoto
                        </span>
                      )}
                      {vaga.tipo && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {vaga.tipo}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    {vaga.salario && (
                      <div className="text-lg font-bold mb-1" style={{color: '#7BB7EB'}}>
                        {formatSalary(vaga.salario)}
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      {formatDate(vaga.data_inicio || '')}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {vaga.descricao}
                </p>

                {vaga.acess && parseAccessibility(vaga.acess).length > 0 && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-semibold" style={{color: '#7BB7EB'}}>♿ Acessibilidade:</span>
                    <div className="flex flex-wrap gap-2">
                      {parseAccessibility(vaga.acess).slice(0, 3).map((item: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 rounded text-xs" style={{color: '#7BB7EB'}}>
                          {item}
                        </span>
                      ))}
                      {parseAccessibility(vaga.acess).length > 3 && (
                        <span className="text-xs text-gray-500">+{parseAccessibility(vaga.acess).length - 3} mais</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    className="px-6 py-2 rounded-lg font-medium text-white hover:opacity-90 transition flex items-center space-x-2"
                    style={{backgroundColor: '#7BB7EB'}}
                  >
                    <span>Ver detalhes</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedVaga && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-start z-10">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedVaga.titulo}
                </h2>
                <div className="flex items-center space-x-2 text-gray-700 font-medium text-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{getEmpresaName(selectedVaga)}</span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="ml-4 text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6 space-y-6">
              {/* Info Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border-l-4" style={{borderLeftColor: '#7BB7EB'}}>
                  <div className="text-sm text-gray-600 mb-1">Localização</div>
                  <div className="font-semibold text-gray-900">{selectedVaga.localidade}</div>
                  {selectedVaga.localidade?.toLowerCase().includes('remoto') && (
                    <div className="text-xs text-green-600 mt-1">🏠 Trabalho Remoto</div>
                  )}
                </div>
                {selectedVaga.tipo && (
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4" style={{borderLeftColor: '#7BB7EB'}}>
                    <div className="text-sm text-gray-600 mb-1">Tipo de Contrato</div>
                    <div className="font-semibold text-gray-900">{selectedVaga.tipo}</div>
                  </div>
                )}
                {selectedVaga.salario && (
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4" style={{borderLeftColor: '#7BB7EB'}}>
                    <div className="text-sm text-gray-600 mb-1">Salário</div>
                    <div className="font-semibold text-gray-900">{formatSalary(selectedVaga.salario)}</div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">📝</span>
                  Descrição da Vaga
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedVaga.descricao}
                </p>
              </div>

              {/* Accessibility */}
              {selectedVaga.acess && parseAccessibility(selectedVaga.acess).length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <span className="mr-2">♿</span>
                    Recursos de Acessibilidade
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {parseAccessibility(selectedVaga.acess).map((item: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2 bg-blue-50 rounded-lg p-3">
                        <svg className="w-5 h-5 flex-shrink-0" style={{color: '#7BB7EB'}} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-8 py-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Publicada {formatDate(selectedVaga.data_inicio || '')}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 border-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
                  style={{borderColor: '#7BB7EB', color: '#7BB7EB'}}
                >
                  Fechar
                </button>
                <button
                  onClick={handleApplyToVaga}
                  disabled={isApplying}
                  className="px-8 py-3 rounded-lg font-medium text-white hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  style={{backgroundColor: '#7BB7EB'}}
                >
                  {isApplying ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Candidatando...</span>
                    </>
                  ) : (
                    <span>Candidatar-se</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Personalizado */}
      {popup.show && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div
            className={`rounded-lg shadow-2xl p-4 flex items-center space-x-3 min-w-[320px] ${
              popup.type === 'success'
                ? 'bg-green-50 border-l-4 border-green-500'
                : 'bg-red-50 border-l-4 border-red-500'
            }`}
          >
            {popup.type === 'success' ? (
              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <div className="flex-1">
              <p className={`font-semibold ${popup.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {popup.type === 'success' ? 'Sucesso!' : 'Erro'}
              </p>
              <p className={`text-sm ${popup.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                {popup.message}
              </p>
            </div>
            <button
              onClick={() => setPopup({ ...popup, show: false })}
              className={`flex-shrink-0 ${popup.type === 'success' ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
