'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { loginCandidate } from '@/src/lib/api/auth/loginCandidate';
import { loginCompany } from '@/src/lib/api/auth/loginCompany';

type TipoLogin = 'candidato' | 'empresa';

export default function LoginPage() {
  const router = useRouter();
  const { login, logout } = useAuth();
  
  const [tipoLogin, setTipoLogin] = useState<TipoLogin>('candidato');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showPopup('error', 'Email é obrigatório');
      return;
    }

    if (!senha.trim()) {
      showPopup('error', 'Senha é obrigatória');
      return;
    }

    setIsSubmitting(true);

    try {
      // Limpar dados do usuário anterior antes de fazer novo login
      logout();
      
      const credentials = { email, senha: senha };
      let response;

      if (tipoLogin === 'candidato') {
        response = await loginCandidate(credentials);
      } else {
        response = await loginCompany(credentials);
      }

      console.log('=== RESPOSTA DO LOGIN ===');
      console.log('Response completo:', response);
      
      // Backend retorna: { message: { user: {...}, token: "..." } }
      
      if (response && response.message && response.message.user && response.message.token) {
        const { user: userData, token } = response.message;
        let formattedUser;

        if (tipoLogin === 'candidato') {
          formattedUser = {
            id: userData.id,
            name: userData.nome,
            email: userData.email,
            cpf: userData.cpf,
            phone: userData.telefone,
            birth_date: userData.data_nascimento,
            deficiencia: userData.deficiencia, // Salvar ID da deficiência
            tipo: 'candidate' as const,
          };
          
          console.log('=== DADOS DO CANDIDATO ===');
          console.log('Deficiência do usuário:', userData.deficiencia);
          console.log('Tipo de deficiência:', userData.tipo_deficiencia);
          console.log('Dados formatados:', formattedUser);
        } else {
          formattedUser = {
            id: userData.id,
            trade_name: userData.nome_fantasia,
            company_name: userData.razao_social,
            email: userData.email,
            cnpj: userData.cnpj,
            phone: userData.telefone,
            accessibility: userData.acessibilidade || userData.accessibility || '', // Acessibilidades da empresa
            tipo: 'company' as const,
          };
          
          console.log('=== DADOS DA EMPRESA ===');
          console.log('Acessibilidades:', userData.acessibilidade || userData.accessibility);
          console.log('Dados formatados:', formattedUser);
        }

        showPopup('success', 'Login realizado com sucesso!');

        // Armazenar dados do usuário e token JWT via AuthContext
        // Cast to any to allow additional optional fields (e.g. 'deficiencia') not present in the strict User type
        login(formattedUser as any, token, tipoLogin === 'candidato' ? 'candidate' : 'company');
        
        setTimeout(() => {
          // Redirecionar para o perfil
          router.push('/perfil');
        }, 1500);
      } else {
        showPopup('error', 'Resposta inválida do servidor');
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      showPopup('error', error.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
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
                href="/cadastro"
                className="px-6 py-2 font-medium hover:opacity-80 transition"
                style={{color: '#7BB7EB'}}
              >
                Criar conta
              </a>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Hero Section */}
          <div className="px-8 py-10 text-center" style={{background: 'linear-gradient(to right, #7BB7EB, #52606B)'}}>
            <h1 className="text-4xl font-bold text-white mb-3">
              Bem-vindo de volta!
            </h1>
            <p className="text-white opacity-90 text-lg">
              Faça login para continuar
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setTipoLogin('candidato')}
              className={`flex-1 py-4 px-6 text-center font-semibold text-lg transition-all relative ${
                tipoLogin === 'candidato'
                  ? 'bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              style={tipoLogin === 'candidato' ? {color: '#7BB7EB'} : {}}
            >
              {tipoLogin === 'candidato' && (
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{backgroundColor: '#7BB7EB'}}></div>
              )}
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Candidato</span>
              </div>
            </button>
            <button
              onClick={() => setTipoLogin('empresa')}
              className={`flex-1 py-4 px-6 text-center font-semibold text-lg transition-all relative ${
                tipoLogin === 'empresa'
                  ? 'bg-orange-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              style={tipoLogin === 'empresa' ? {color: '#ECAE7D'} : {}}
            >
              {tipoLogin === 'empresa' && (
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{backgroundColor: '#ECAE7D'}}></div>
              )}
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Empresa</span>
              </div>
            </button>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm hover:border-gray-400"
                  placeholder="seu@email.com"
                  style={{color: '#111827'}}
                />
              </div>

              {/* Senha */}
              <div>
                <label
                  htmlFor="senha"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Senha *
                </label>
                <input
                  type="password"
                  id="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm hover:border-gray-400"
                  placeholder="Digite sua senha"
                  style={{color: '#111827'}}
                />
              </div>

              {/* Esqueceu a senha */}
              <div className="text-right">
                <a
                  href="#"
                  className="text-sm font-medium hover:opacity-80 transition"
                  style={{color: tipoLogin === 'candidato' ? '#7BB7EB' : '#ECAE7D'}}
                >
                  Esqueceu a senha?
                </a>
              </div>

              {/* Botão Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white py-4 px-6 rounded-lg font-semibold text-lg hover:opacity-90 focus:outline-none focus:ring-4 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: tipoLogin === 'candidato' ? '#7BB7EB' : '#ECAE7D',
                  boxShadow: `0 4px 6px -1px ${tipoLogin === 'candidato' ? 'rgba(123, 183, 235, 0.3)' : 'rgba(236, 174, 125, 0.3)'}`
                }}
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            {/* Link para cadastro */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Não tem uma conta?{' '}
                <a
                  href="/cadastro"
                  className="font-semibold hover:opacity-80 transition"
                  style={{color: tipoLogin === 'candidato' ? '#7BB7EB' : '#ECAE7D'}}
                >
                  Cadastre-se
                </a>
              </p>
            </div>
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
