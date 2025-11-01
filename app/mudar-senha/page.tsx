'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { changePassword } from '@/src/lib/api/auth/changePassword';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, isAuthenticated, userType, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const showPopup = (type: 'success' | 'error', message: string) => {
    setPopup({ show: true, type, message });
    setTimeout(() => {
      setPopup({ show: false, type, message: '' });
    }, 4000);
  };

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showPopup('error', 'Email é obrigatório');
      return;
    }

    if (!novaSenha.trim()) {
      showPopup('error', 'Nova senha é obrigatória');
      return;
    }

    if (novaSenha.length < 3) {
      showPopup('error', 'A nova senha deve ter no mínimo 3 caracteres');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      showPopup('error', 'As senhas não coincidem');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user?.id) {
        throw new Error('Usuário não identificado');
      }

      await changePassword(user.id, email, novaSenha, confirmarSenha);
      
      showPopup('success', 'Senha alterada com sucesso!');
      
      // Limpar campos
      setEmail('');
      setNovaSenha('');
      setConfirmarSenha('');

      // Redirecionar após 2 segundos
      setTimeout(() => {
        if (userType === 'candidate') {
          router.push('/vaga');
        } else if (userType === 'company') {
          router.push('/vaga/create');
        } else {
          router.push('/admin');
        }
      }, 2000);

    } catch (error: any) {
      console.error('Erro ao mudar senha:', error);
      showPopup('error', error.message || 'Erro ao mudar senha. Verifique a senha atual.');
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

  // Cores baseadas no tipo de usuário
  const primaryColor = userType === 'candidate' ? '#7BB7EB' : userType === 'company' ? '#ECAE7D' : '#DC2626';
  const gradientFrom = userType === 'candidate' ? 'from-blue-50' : userType === 'company' ? 'from-orange-50' : 'from-red-50';
  const gradientTo = userType === 'candidate' ? 'to-sky-50' : userType === 'company' ? 'to-amber-50' : 'to-rose-50';

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
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition"
              >
                Voltar
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 py-10 text-center" style={{backgroundColor: primaryColor}}>
            <div className="mb-4 flex justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Alterar Senha
            </h1>
            <p className="text-white opacity-90">
              Crie uma nova senha segura
            </p>
          </div>

          {/* Form */}
          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition shadow-sm hover:border-gray-400"
                  style={{color: '#111827'}}
                  placeholder="Digite seu email"
                />
              </div>

              {/* Nova Senha */}
              <div>
                <label
                  htmlFor="novaSenha"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Nova Senha *
                </label>
                <input
                  type="password"
                  id="novaSenha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition shadow-sm hover:border-gray-400"
                  style={{color: '#111827'}}
                  placeholder="Digite sua nova senha"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Mínimo de 3 caracteres
                </p>
              </div>

              {/* Confirmar Senha */}
              <div>
                <label
                  htmlFor="confirmarSenha"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Confirmar Nova Senha *
                </label>
                <input
                  type="password"
                  id="confirmarSenha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition shadow-sm hover:border-gray-400"
                  style={{color: '#111827'}}
                  placeholder="Confirme sua nova senha"
                />
              </div>

              {/* Botão Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white py-4 px-6 rounded-lg font-semibold text-lg hover:opacity-90 focus:outline-none focus:ring-4 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: primaryColor,
                }}
              >
                {isSubmitting ? 'Alterando...' : 'Alterar Senha'}
              </button>
            </form>
          </div>
        </div>
      </div>

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
