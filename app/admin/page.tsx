'use client';

import React, { useState, useEffect } from 'react';
import { createSubTipo } from '@/src/lib/api/admin/createSubTipo';
import { createBarreira } from '@/src/lib/api/admin/createBarreira';
import { createAcessibilidade } from '@/src/lib/api/admin/createAcessibilidade';
import { getAnalitycs } from '@/src/lib/api/admin/getAnalitycs';

type DeficienciaType = 'visual' | 'motora' | 'auditiva' | '';

interface BarreiraItem {
  id: string;
  descricao: string;
}

interface AcessibilidadeItem {
  id: string;
  descricao: string;
}

export default function AdminPage() {
  // Estado para controlar qual formulário está ativo
  const [activeForm, setActiveForm] = useState<'subtipo' | 'barreira' | 'acessibilidade'>('subtipo');

  // Estados para dados do banco
  const [barreiras, setBarreiras] = useState<BarreiraItem[]>([]);
  const [acessibilidades, setAcessibilidades] = useState<AcessibilidadeItem[]>([]);

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

  // Estados dos formulários
  const [formSubtipo, setFormSubtipo] = useState({
    nome: '',
    deficiencia: '' as DeficienciaType,
    barreira: '',
    acessibilidade: '',
  });

  const [formBarreira, setFormBarreira] = useState({
    nome: '',
  });

  const [formAcessibilidade, setFormAcessibilidade] = useState({
    nome: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buscar dados do banco ao carregar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAnalitycs();
        
        if (response && response.message && Array.isArray(response.message)) {
          // Extrair barreiras únicas com IDs
          const barreirasMap = new Map<string, BarreiraItem>();
          response.message.forEach((item: any) => {
            if (item.id_barreira && item.descricao_barreira) {
              barreirasMap.set(item.id_barreira, {
                id: item.id_barreira,
                descricao: item.descricao_barreira
              });
            }
          });
          
          // Extrair acessibilidades únicas com IDs
          const acessibilidadesMap = new Map<string, AcessibilidadeItem>();
          response.message.forEach((item: any) => {
            if (item.id_acessibilidade && item.descricao_acessibilidade) {
              acessibilidadesMap.set(item.id_acessibilidade, {
                id: item.id_acessibilidade,
                descricao: item.descricao_acessibilidade
              });
            }
          });

          
          setBarreiras(Array.from(barreirasMap.values()));
          setAcessibilidades(Array.from(acessibilidadesMap.values()));

          console.log('Barreiras:', Array.from(barreirasMap.values()));
          console.log('Acessibilidades:', Array.from(acessibilidadesMap.values()));
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  // Função para mostrar popup
  const showPopup = (type: 'success' | 'error', message: string) => {
    setPopup({ show: true, type, message });
    setTimeout(() => {
      setPopup({ show: false, type, message: '' });
    }, 4000);
  };

  // Handler para Subtipo
  const handleSubmitSubtipo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formSubtipo.nome.trim()) {
      showPopup('error', 'Nome do subtipo é obrigatório');
      return;
    }
    
    if (!formSubtipo.deficiencia) {
      showPopup('error', 'Selecione um tipo de deficiência');
      return;
    }

    if (!formSubtipo.barreira.trim()) {
      showPopup('error', 'Barreira é obrigatória');
      return;
    }

    if (!formSubtipo.acessibilidade.trim()) {
      showPopup('error', 'Acessibilidade é obrigatória');
      return;
    }

    setIsSubmitting(true);

    try {
      // Mapear tipo de deficiência para IDs mocados
      const tipoIdMap: { [key: string]: string } = {
        'motora': 'DMOTO-0001',
        'visual': 'DVISU-0001',
        'auditiva': 'DAUDI-0001'
      };

      const tipoId = tipoIdMap[formSubtipo.deficiencia] || '';

      // Formatar data no formato YYYY/MM/DD esperado pela API
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const horaFormatada = `${year}/${month}/${day}`;

      const data = {
        descricao: formSubtipo.nome,
        hora: horaFormatada,
        tipo: tipoId,
        barreira: formSubtipo.barreira,
        acessibilidade: formSubtipo.acessibilidade,
      };

      console.log('Enviando dados:', data);

      const response = await createSubTipo(data);
      
      console.log('Response status:', response?.status);
      
      if (response?.ok) {
        const result = await response.json();
        console.log('Subtipo criado:', result);
        showPopup('success', 'Subtipo criado com sucesso!');
        setFormSubtipo({
          nome: '',
          deficiencia: '',
          barreira: '',
          acessibilidade: '',
        });
        // Recarrega dados para atualizar lista
        window.location.reload();
      } else {
        const errorData = await response?.json().catch(() => ({}));
        console.error('Erro ao criar subtipo:', errorData);
        showPopup('error', errorData?.message || 'Erro ao criar subtipo');
      }
    } catch (error) {
      console.error('Erro:', error);
      showPopup('error', 'Erro ao criar subtipo');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler para Barreira
  const handleSubmitBarreira = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formBarreira.nome.trim()) {
      showPopup('error', 'Nome da barreira é obrigatório');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        descricao: formBarreira.nome,
      };

      console.log('Criando barreira:', data);
      const response = await createBarreira(data);
      
      console.log('Response status:', response?.status);
      
      if (response?.ok) {
        const result = await response.json();
        console.log('Barreira criada:', result);
        showPopup('success', 'Barreira criada com sucesso!');
        setFormBarreira({ nome: '' });
        // Recarrega dados para atualizar lista
        window.location.reload();
      } else {
        const errorData = await response?.json().catch(() => ({}));
        console.error('Erro ao criar barreira:', errorData);
        showPopup('error', errorData?.message || 'Erro ao criar barreira');
      }
    } catch (error) {
      console.error('Erro:', error);
      showPopup('error', 'Erro ao criar barreira');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler para Acessibilidade
  const handleSubmitAcessibilidade = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formAcessibilidade.nome.trim()) {
      showPopup('error', 'Nome da acessibilidade é obrigatório');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        descricao: formAcessibilidade.nome,
      };

      console.log('Criando acessibilidade:', data);
      const response = await createAcessibilidade(data);
      
      console.log('Response status:', response?.status);
      
      if (response?.ok) {
        const result = await response.json();
        console.log('Acessibilidade criada:', result);
        showPopup('success', 'Acessibilidade criada com sucesso!');
        setFormAcessibilidade({ nome: '' });
        // Recarrega dados para atualizar lista
        window.location.reload();
      } else {
        const errorData = await response?.json().catch(() => ({}));
        console.error('Erro ao criar acessibilidade:', errorData);
        showPopup('error', errorData?.message || 'Erro ao criar acessibilidade');
      }
    } catch (error) {
      console.error('Erro:', error);
      showPopup('error', 'Erro ao criar acessibilidade');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: '#DC2626'}}>
                <span className="text-white font-bold text-xl">AD</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Administração</span>
            </a>
            <div className="flex space-x-4">
              <a href="/" className="px-6 py-2 font-medium hover:opacity-80 transition" style={{color: '#DC2626'}}>
                Voltar
              </a>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Hero Section */}
          <div className="px-8 py-10 text-center" style={{background: 'linear-gradient(to right, #DC2626, #EF4444)'}}>
            <h1 className="text-4xl font-bold text-white mb-3">
              Painel de Administração
            </h1>
            <p className="text-white opacity-90 text-lg">
              Gerencie subtipos, barreiras e acessibilidades
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveForm('subtipo')}
              className={`flex-1 py-4 px-6 text-center font-semibold text-lg transition-all relative ${
                activeForm === 'subtipo'
                  ? 'bg-red-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              style={activeForm === 'subtipo' ? {color: '#DC2626'} : {}}
            >
              {activeForm === 'subtipo' && (
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{backgroundColor: '#DC2626'}}></div>
              )}
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>Criar Subtipo</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveForm('barreira')}
              className={`flex-1 py-4 px-6 text-center font-semibold text-lg transition-all relative ${
                activeForm === 'barreira'
                  ? 'bg-red-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              style={activeForm === 'barreira' ? {color: '#DC2626'} : {}}
            >
              {activeForm === 'barreira' && (
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{backgroundColor: '#DC2626'}}></div>
              )}
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Criar Barreira</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveForm('acessibilidade')}
              className={`flex-1 py-4 px-6 text-center font-semibold text-lg transition-all relative ${
                activeForm === 'acessibilidade'
                  ? 'bg-red-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              style={activeForm === 'acessibilidade' ? {color: '#DC2626'} : {}}
            >
              {activeForm === 'acessibilidade' && (
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{backgroundColor: '#DC2626'}}></div>
              )}
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Criar Acessibilidade</span>
              </div>
            </button>
          </div>

          <div className="p-8 md:p-10">
            {/* Formulário Subtipo */}
            {activeForm === 'subtipo' && (
              <form onSubmit={handleSubmitSubtipo} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{borderColor: '#DC2626'}}>
                    📋 Informações do Subtipo
                  </h3>
                  
                  {/* Nome do Subtipo */}
                  <div className="mb-6">
                    <label htmlFor="nome-subtipo" className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome do Subtipo *
                    </label>
                    <input
                      type="text"
                      id="nome-subtipo"
                      value={formSubtipo.nome}
                      onChange={(e) => setFormSubtipo({...formSubtipo, nome: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition shadow-sm hover:border-gray-400"
                      placeholder="Digite o nome do subtipo"
                      style={{color: '#111827'}}
                    />
                  </div>

                  {/* Tipo de Deficiência (Radio) */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Tipo de Deficiência *
                    </label>
                    <div className="grid md:grid-cols-3 gap-3">
                      <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                        formSubtipo.deficiencia === 'visual' 
                          ? 'border-red-600 bg-red-50' 
                          : 'border-gray-300 hover:border-red-300'
                      }`}>
                        <input
                          type="radio"
                          name="deficiencia"
                          value="visual"
                          checked={formSubtipo.deficiencia === 'visual'}
                          onChange={(e) => setFormSubtipo({...formSubtipo, deficiencia: e.target.value as DeficienciaType})}
                          className="w-5 h-5 text-red-600"
                        />
                        <span className="ml-3 font-medium text-gray-700">👁️ Visual</span>
                      </label>

                      <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                        formSubtipo.deficiencia === 'motora' 
                          ? 'border-red-600 bg-red-50' 
                          : 'border-gray-300 hover:border-red-300'
                      }`}>
                        <input
                          type="radio"
                          name="deficiencia"
                          value="motora"
                          checked={formSubtipo.deficiencia === 'motora'}
                          onChange={(e) => setFormSubtipo({...formSubtipo, deficiencia: e.target.value as DeficienciaType})}
                          className="w-5 h-5 text-red-600"
                        />
                        <span className="ml-3 font-medium text-gray-700">♿ Motora</span>
                      </label>

                      <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                        formSubtipo.deficiencia === 'auditiva' 
                          ? 'border-red-600 bg-red-50' 
                          : 'border-gray-300 hover:border-red-300'
                      }`}>
                        <input
                          type="radio"
                          name="deficiencia"
                          value="auditiva"
                          checked={formSubtipo.deficiencia === 'auditiva'}
                          onChange={(e) => setFormSubtipo({...formSubtipo, deficiencia: e.target.value as DeficienciaType})}
                          className="w-5 h-5 text-red-600"
                        />
                        <span className="ml-3 font-medium text-gray-700">👂 Auditiva</span>
                      </label>
                    </div>
                  </div>

                  {/* Barreira */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Barreira *
                    </label>
                    <div className="grid md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                      {barreiras.map((barreira) => (
                        <label 
                          key={barreira.id}
                          className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                            formSubtipo.barreira === barreira.id 
                              ? 'border-red-600 bg-red-50' 
                              : 'border-gray-300 hover:border-red-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="barreira"
                            value={barreira.id}
                            checked={formSubtipo.barreira === barreira.id}
                            onChange={(e) => setFormSubtipo({...formSubtipo, barreira: e.target.value})}
                            className="w-4 h-4 text-red-600 flex-shrink-0"
                          />
                          <span className="ml-3 text-sm font-medium text-gray-700">{barreira.descricao}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Acessibilidade */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Acessibilidade *
                    </label>
                    <div className="grid md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                      {acessibilidades.map((acessibilidade) => (
                        <label 
                          key={acessibilidade.id}
                          className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                            formSubtipo.acessibilidade === acessibilidade.id 
                              ? 'border-red-600 bg-red-50' 
                              : 'border-gray-300 hover:border-red-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="acessibilidade"
                            value={acessibilidade.id}
                            checked={formSubtipo.acessibilidade === acessibilidade.id}
                            onChange={(e) => setFormSubtipo({...formSubtipo, acessibilidade: e.target.value})}
                            className="w-4 h-4 text-red-600 flex-shrink-0"
                          />
                          <span className="ml-3 text-sm font-medium text-gray-700">{acessibilidade.descricao}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white py-4 px-6 rounded-lg font-semibold text-lg hover:opacity-90 focus:outline-none focus:ring-4 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{backgroundColor: '#DC2626', boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.3)'}}
                >
                  {isSubmitting ? 'Criando...' : 'Criar Subtipo'}
                </button>
              </form>
            )}

            {/* Formulário Barreira */}
            {activeForm === 'barreira' && (
              <form onSubmit={handleSubmitBarreira} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{borderColor: '#DC2626'}}>
                    ⚠️ Informações da Barreira
                  </h3>
                  
                  <div>
                    <label htmlFor="nome-barreira" className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome da Barreira *
                    </label>
                    <input
                      type="text"
                      id="nome-barreira"
                      value={formBarreira.nome}
                      onChange={(e) => setFormBarreira({nome: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition shadow-sm hover:border-gray-400"
                      placeholder="Digite o nome da barreira"
                      style={{color: '#111827'}}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white py-4 px-6 rounded-lg font-semibold text-lg hover:opacity-90 focus:outline-none focus:ring-4 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{backgroundColor: '#DC2626', boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.3)'}}
                >
                  {isSubmitting ? 'Criando...' : 'Criar Barreira'}
                </button>
              </form>
            )}

            {/* Formulário Acessibilidade */}
            {activeForm === 'acessibilidade' && (
              <form onSubmit={handleSubmitAcessibilidade} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{borderColor: '#DC2626'}}>
                    ✅ Informações da Acessibilidade
                  </h3>
                  
                  <div>
                    <label htmlFor="nome-acessibilidade" className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome da Acessibilidade *
                    </label>
                    <input
                      type="text"
                      id="nome-acessibilidade"
                      value={formAcessibilidade.nome}
                      onChange={(e) => setFormAcessibilidade({nome: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition shadow-sm hover:border-gray-400"
                      placeholder="Digite o nome da acessibilidade"
                      style={{color: '#111827'}}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white py-4 px-6 rounded-lg font-semibold text-lg hover:opacity-90 focus:outline-none focus:ring-4 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{backgroundColor: '#DC2626', boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.3)'}}
                >
                  {isSubmitting ? 'Criando...' : 'Criar Acessibilidade'}
                </button>
              </form>
            )}
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
