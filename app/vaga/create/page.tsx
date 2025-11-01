'use client';

import React, { useState, useEffect } from 'react';
import { createVaga } from '@/src/lib/api/vaga/createVaga';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';

export default function CriarVaga() {
  const router = useRouter();
  const { user, isAuthenticated, userType, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salary: '',
    location: '',
    type: '',
    end_date: '',
    tipo_acess: [] as string[], // Array para múltiplas deficiências
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirecionar se não estiver autenticado ou não for empresa
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || userType !== 'company')) {
      router.push('/login');
    }
  }, [isAuthenticated, userType, isLoading, router]);

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

  const tiposVaga = [
    'PJ',
    'CLT',
    'Estágio',
  ];

  const tiposDeficiencia = [
    { label: 'Deficiente Visual', value: 'DVISU' },
    { label: 'Deficiente Motora', value: 'DMOTO' },
    { label: 'Deficiente Auditivo', value: 'DAUDI' },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const formatSalary = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Converte para formato de moeda
    const numberValue = parseInt(numbers) / 100;
    return numberValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSalary(e.target.value);
    setFormData((prev) => ({
      ...prev,
      salary: formatted,
    }));

    if (errors.salary) {
      setErrors((prev) => ({
        ...prev,
        salary: '',
      }));
    }
  };

  // Função para lidar com checkboxes de tipo de deficiência
  const handleTipoDeficienciaChange = (value: string) => {
    setFormData((prev) => {
      const tipos = prev.tipo_acess.includes(value)
        ? prev.tipo_acess.filter((t) => t !== value)
        : [...prev.tipo_acess, value];
      return { ...prev, tipo_acess: tipos };
    });

    // Limpar erro se existir
    if (errors.tipo_acess) {
      setErrors((prev) => ({
        ...prev,
        tipo_acess: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título da vaga é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (formData.description.trim().length < 50) {
      newErrors.description = 'Descrição deve ter no mínimo 50 caracteres';
    }

    if (!formData.salary) {
      newErrors.salary = 'Salário é obrigatório';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Localização é obrigatória';
    }

    if (!formData.type) {
      newErrors.type = 'Tipo de vaga é obrigatório';
    }

    if (!formData.tipo_acess || formData.tipo_acess.length === 0) {
      newErrors.tipo_acess = 'Selecione pelo menos um tipo de deficiência';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'Data de encerramento é obrigatória';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.end_date);
      
      if (selectedDate < today) {
        newErrors.end_date = 'A data de encerramento deve ser futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user?.id) {
        throw new Error('Empresa não identificada. Faça login novamente.');
      }

      // Converter salário de string para número
      const salaryNumber = parseFloat(formData.salary.replace(/\./g, '').replace(',', '.'));

      const vagaData = {
        title: formData.title,
        description: formData.description,
        salary: salaryNumber,
        location: formData.location,
        type: formData.type,
        end_date: new Date(formData.end_date),
        company_id: user.id,
        type_acessibility: formData.tipo_acess.join(', '), // Converte array para string separada por vírgulas
      };

      console.log('Enviando dados:', vagaData);

      const response = await createVaga(vagaData);

      console.log('Resposta da API:', response);
      showPopup('success', 'Vaga criada com sucesso!');

      // Limpar formulário após 1.5s e redirecionar se necessário
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          salary: '',
          location: '',
          type: '',
          end_date: '',
          tipo_acess: [],
        });
      }, 1500);

      // Opcionalmente redirecionar para lista de vagas
      // setTimeout(() => router.push('/vagas'), 2000);

    } catch (error) {
      console.error('Erro ao criar vaga:', error);
      showPopup('error', 'Erro ao criar vaga. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header/Navbar */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: '#ECAE7D'}}>
                <span className="text-white font-bold text-xl">PC</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">PCDentro</span>
            </a>
            <div className="flex space-x-4">
              <a
                href="/perfil"
                className="px-6 py-2 font-medium hover:opacity-80 transition"
                style={{color: '#ECAE7D'}}
              >
                Perfil
              </a>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Hero Section */}
          <div className="px-8 py-10 text-center" style={{background: 'linear-gradient(to right, #ECAE7D, #ECCD7B)'}}>
            <h1 className="text-4xl font-bold text-white mb-3">
              Criar Nova Vaga
            </h1>
            <p className="text-white opacity-90 text-lg">
              Publique uma oportunidade inclusiva e encontre o candidato ideal
            </p>
          </div>

          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Seção: Informações Básicas */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{borderColor: '#ECAE7D'}}>
                  📝 Informações da Vaga
                </h3>
                <div className="space-y-6">
                  {/* Título da Vaga */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                      Título da Vaga *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-orange-400 transition shadow-sm hover:border-gray-400"
                      placeholder="Ex: Desenvolvedor Full Stack"
                      style={{color: '#111827'}}
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Descrição */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                      Descrição da Vaga *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-orange-400 transition shadow-sm hover:border-gray-400 resize-none"
                      placeholder="Descreva as responsabilidades, requisitos e benefícios da vaga..."
                      style={{color: '#111827'}}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      {formData.description.length} caracteres (mínimo 50)
                    </p>
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Grid para Salário e Tipo */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Salário */}
                    <div>
                      <label htmlFor="salary" className="block text-sm font-semibold text-gray-700 mb-2">
                        Salário (R$) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">R$</span>
                        <input
                          type="text"
                          id="salary"
                          name="salary"
                          value={formData.salary}
                          onChange={handleSalaryChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-orange-400 transition shadow-sm hover:border-gray-400"
                          placeholder="0,00"
                          style={{color: '#111827'}}
                        />
                      </div>
                      {errors.salary && (
                        <p className="mt-2 text-sm text-red-600">{errors.salary}</p>
                      )}
                    </div>

                    {/* Tipo de Vaga */}
                    <div>
                      <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                        Tipo de Vaga *
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-orange-400 transition shadow-sm hover:border-gray-400"
                        style={{color: '#111827'}}
                      >
                        <option value="">Selecione o tipo</option>
                        {tiposVaga.map((tipo) => (
                          <option key={tipo} value={tipo}>
                            {tipo}
                          </option>
                        ))}
                      </select>
                      {errors.type && (
                        <p className="mt-2 text-sm text-red-600">{errors.type}</p>
                      )}
                    </div>
                  </div>

                  {/* Grid para Localização e Data */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Localização */}
                    <div>
                      <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                        Localização *
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-orange-400 transition shadow-sm hover:border-gray-400"
                        placeholder="Ex: São Paulo - SP"
                        style={{color: '#111827'}}
                      />
                      {errors.location && (
                        <p className="mt-2 text-sm text-red-600">{errors.location}</p>
                      )}
                    </div>

                    {/* Data de Encerramento */}
                    <div>
                      <label htmlFor="end_date" className="block text-sm font-semibold text-gray-700 mb-2">
                        Data de Encerramento *
                      </label>
                      <input
                        type="date"
                        id="end_date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-orange-400 transition shadow-sm hover:border-gray-400"
                        style={{color: '#111827'}}
                      />
                      {errors.end_date && (
                        <p className="mt-2 text-sm text-red-600">{errors.end_date}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção: Tipo de Deficiência */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{borderColor: '#ECAE7D'}}>
                  ♿ Tipo de Deficiência Aceito
                </h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Selecione os tipos de deficiência que esta vaga aceita (selecione uma ou mais opções)
                  </p>
                  <div className="grid md:grid-cols-3 gap-3">
                    {tiposDeficiencia.map((tipo) => (
                      <label
                        key={tipo.value}
                        className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                          formData.tipo_acess.includes(tipo.value)
                            ? 'bg-orange-50'
                            : 'border-gray-300 hover:opacity-80 bg-white'
                        }`}
                        style={formData.tipo_acess.includes(tipo.value) ? {borderColor: '#ECAE7D'} : {}}
                      >
                        <input
                          type="checkbox"
                          checked={formData.tipo_acess.includes(tipo.value)}
                          onChange={() => handleTipoDeficienciaChange(tipo.value)}
                          className="mt-1 h-4 w-4 rounded border-gray-300 flex-shrink-0"
                          style={{accentColor: '#ECAE7D'}}
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">{tipo.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.tipo_acess && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.tipo_acess}
                    </p>
                  )}
                </div>
              </div>

              {/* Botão de Submit */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white py-4 px-6 rounded-lg font-semibold text-lg hover:opacity-90 focus:outline-none focus:ring-4 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{backgroundColor: '#ECAE7D', boxShadow: '0 4px 6px -1px rgba(236, 174, 125, 0.3)'}}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Criando Vaga...
                    </span>
                  ) : (
                    'Publicar Vaga'
                  )}
                </button>
                <p className="mt-4 text-sm text-gray-500 text-center">
                  Ao publicar uma vaga, você concorda em seguir as políticas de inclusão da plataforma
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Precisa de ajuda?{' '}
            <a
              href="/suporte"
              className="font-semibold hover:opacity-80 transition"
              style={{color: '#ECAE7D'}}
            >
              Entre em contato
            </a>
          </p>
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
