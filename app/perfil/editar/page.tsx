'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { updateCandidate } from '@/src/lib/api/candidate/updateCandidate';
import { updateCompany } from '@/src/lib/api/empresa/updateCompany';

export default function EditarPerfilPage() {
  const router = useRouter();
  const { user, isAuthenticated, userType, isLoading } = useAuth();
  
  // Estados para candidato
  const [candidateData, setCandidateData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    birth_date: '',
    cep: '',
    rua: '',
    num_casa: '',
    complemento: '',
  });

  // Estados para empresa
  const [companyData, setCompanyData] = useState({
    trade_name: '',
    company_name: '',
    email: '',
    cnpj: '',
    phone: '',
    accessibility: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Popup
  const [popup, setPopup] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    show: false,
    type: 'success',
    message: '',
  });

  const showPopup = (type: 'success' | 'error', message: string) => {
    setPopup({ show: true, type, message });
    setTimeout(() => {
      setPopup({ show: false, type, message: '' });
    }, 4000);
  };

  // Carregar dados do usuário
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      if (userType === 'candidate' && 'name' in user && 'phone' in user && 'cpf' in user && 'birth_date' in user) {
        setCandidateData({
          name: user.name || '',
          email: user.email || '',
          cpf: user.cpf || '',
          phone: user.phone || '',
          birth_date: user.birth_date ? new Date(user.birth_date).toISOString().split('T')[0] : '',
          cep: '',
          rua: '',
          num_casa: '',
          complemento: '',
        });
      } else if (userType === 'company' && 'trade_name' in user && 'company_name' in user && 'phone' in user && 'cnpj' in user) {
        setCompanyData({
          trade_name: user.trade_name || '',
          company_name: user.company_name || '',
          email: user.email || '',
          cnpj: user.cnpj || '',
          phone: user.phone || '',
          accessibility: '',
        });
      }
    }
  }, [user, userType, isAuthenticated, isLoading, router]);

  const handleSubmitCandidate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!candidateData.name.trim()) {
      showPopup('error', 'Nome é obrigatório');
      return;
    }

    if (!candidateData.email.trim()) {
      showPopup('error', 'Email é obrigatório');
      return;
    }

    if (!candidateData.cpf.trim()) {
      showPopup('error', 'CPF é obrigatório');
      return;
    }

    if (!candidateData.phone.trim()) {
      showPopup('error', 'Telefone é obrigatório');
      return;
    }

    if (!candidateData.birth_date) {
      showPopup('error', 'Data de nascimento é obrigatória');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user?.id) {
        throw new Error('Usuário não identificado');
      }

      await updateCandidate(user.id, candidateData);
      
      showPopup('success', 'Perfil atualizado com sucesso!');
      
      setTimeout(() => {
        router.push('/perfil');
      }, 2000);

    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      showPopup('error', error.message || 'Erro ao atualizar perfil.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitCompany = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyData.trade_name.trim()) {
      showPopup('error', 'Nome fantasia é obrigatório');
      return;
    }

    if (!companyData.company_name.trim()) {
      showPopup('error', 'Razão social é obrigatória');
      return;
    }

    if (!companyData.email.trim()) {
      showPopup('error', 'Email é obrigatório');
      return;
    }

    if (!companyData.cnpj.trim()) {
      showPopup('error', 'CNPJ é obrigatório');
      return;
    }

    if (!companyData.phone.trim()) {
      showPopup('error', 'Telefone é obrigatório');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user?.id) {
        throw new Error('Empresa não identificada');
      }

      await updateCompany(user.id, companyData);
      
      showPopup('success', 'Perfil atualizado com sucesso!');
      
      setTimeout(() => {
        router.push('/perfil');
      }, 2000);

    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      showPopup('error', error.message || 'Erro ao atualizar perfil.');
    } finally {
      setIsSubmitting(false);
    }
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
            <button
              onClick={() => router.push('/perfil')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition"
            >
              Voltar ao Perfil
            </button>
          </div>
        </nav>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 py-10 text-center" style={{backgroundColor: primaryColor}}>
            <h1 className="text-3xl font-bold text-white mb-2">
              Editar Perfil
            </h1>
            <p className="text-white opacity-90">
              Atualize suas informações
            </p>
          </div>

          {/* Form Candidato */}
          {userType === 'candidate' && (
            <form onSubmit={handleSubmitCandidate} className="p-8 md:p-10 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={candidateData.name}
                  onChange={(e) => setCandidateData({...candidateData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition shadow-sm hover:border-gray-400"
                  style={{color: '#111827'}}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={candidateData.email}
                  onChange={(e) => setCandidateData({...candidateData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition shadow-sm hover:border-gray-400"
                  style={{color: '#111827'}}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  value={candidateData.cpf}
                  onChange={(e) => setCandidateData({...candidateData, cpf: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition shadow-sm hover:border-gray-400"
                  style={{color: '#111827'}}
                  placeholder="000.000.000-00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="text"
                  value={candidateData.phone}
                  onChange={(e) => setCandidateData({...candidateData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition shadow-sm hover:border-gray-400"
                  style={{color: '#111827'}}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  value={candidateData.birth_date}
                  onChange={(e) => setCandidateData({...candidateData, birth_date: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition shadow-sm hover:border-gray-400"
                  style={{color: '#111827'}}
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Endereço (Opcional)</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CEP
                    </label>
                    <input
                      type="text"
                      value={candidateData.cep}
                      onChange={(e) => setCandidateData({...candidateData, cep: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition shadow-sm hover:border-gray-400"
                      style={{color: '#111827'}}
                      placeholder="00000-000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rua
                    </label>
                    <input
                      type="text"
                      value={candidateData.rua}
                      onChange={(e) => setCandidateData({...candidateData, rua: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition shadow-sm hover:border-gray-400"
                      style={{color: '#111827'}}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Número
                      </label>
                      <input
                        type="text"
                        value={candidateData.num_casa}
                        onChange={(e) => setCandidateData({...candidateData, num_casa: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition shadow-sm hover:border-gray-400"
                        style={{color: '#111827'}}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Complemento
                      </label>
                      <input
                        type="text"
                        value={candidateData.complemento}
                        onChange={(e) => setCandidateData({...candidateData, complemento: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition shadow-sm hover:border-gray-400"
                        style={{color: '#111827'}}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white py-4 px-6 rounded-lg font-semibold text-lg hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{backgroundColor: primaryColor}}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </form>
          )}

          {/* Form Empresa */}
          {userType === 'company' && (
            <form onSubmit={handleSubmitCompany} className="p-8 md:p-10 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Fantasia *
                </label>
                <input
                  type="text"
                  value={companyData.trade_name}
                  onChange={(e) => setCompanyData({...companyData, trade_name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition shadow-sm hover:border-gray-400"
                  style={{color: '#111827'}}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Razão Social *
                </label>
                <input
                  type="text"
                  value={companyData.company_name}
                  onChange={(e) => setCompanyData({...companyData, company_name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition shadow-sm hover:border-gray-400"
                  style={{color: '#111827'}}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={companyData.email}
                  onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition shadow-sm hover:border-gray-400"
                  style={{color: '#111827'}}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CNPJ *
                </label>
                <input
                  type="text"
                  value={companyData.cnpj}
                  onChange={(e) => setCompanyData({...companyData, cnpj: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition shadow-sm hover:border-gray-400"
                  style={{color: '#111827'}}
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="text"
                  value={companyData.phone}
                  onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition shadow-sm hover:border-gray-400"
                  style={{color: '#111827'}}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Acessibilidade (Opcional)
                </label>
                <textarea
                  value={companyData.accessibility}
                  onChange={(e) => setCompanyData({...companyData, accessibility: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition shadow-sm hover:border-gray-400"
                  style={{color: '#111827'}}
                  rows={3}
                  placeholder="Descreva as condições de acessibilidade da empresa..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white py-4 px-6 rounded-lg font-semibold text-lg hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{backgroundColor: primaryColor}}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Popup */}
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
