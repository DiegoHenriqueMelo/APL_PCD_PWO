'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {postCandidate} from '../../src/lib/api/candidate/postCandidate';
import { postCompany } from '@/src/lib/api/empresa/postCompany';
import { getAnalitycs } from '@/src/lib/api/admin/getAnalitycs';

type DeficienciaType = 'visual' | 'motora' | 'auditiva' | '';
type TipoCadastro = 'candidato' | 'empresa';

interface FormDataCandidato {
  nome: string;
  email: string;
  confirmarEmail: string;
  senha: string;
  confirmarSenha: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  deficiencia: DeficienciaType;
  subtipoDeficiencia: string;
  barreira: string[];
  acessibilidade: string[];
}

interface FormDataEmpresa {
  nomeFantasia: string;
  razaoSocial: string;
  email: string;
  confirmarEmail: string;
  senha: string;
  confirmarSenha: string;
  cnpj: string;
  telefone: string;
  acessibilidade: string[];
}

export default function CadastroUsuario() {
  const router = useRouter();
  
  // Estados para dados dinâmicos da API
  const [subtiposDeficiencia, setSubtiposDeficiencia] = useState<{
    visual: Array<{id: string, nome: string}>;
    motora: Array<{id: string, nome: string}>;
    auditiva: Array<{id: string, nome: string}>;
  }>({
    visual: [],
    motora: [],
    auditiva: []
  });

  const [barreirasPorDeficiencia, setBarreirasPorDeficiencia] = useState<{
    visual: string[];
    motora: string[];
    auditiva: string[];
  }>({
    visual: [],
    motora: [],
    auditiva: []
  });

  const [acessibilidadesPorDeficiencia, setAcessibilidadesPorDeficiencia] = useState<{
    visual: string[];
    motora: string[];
    auditiva: string[];
  }>({
    visual: [],
    motora: [],
    auditiva: []
  });

  const [acessibilidadesEmpresa, setAcessibilidadesEmpresa] = useState<string[]>([]);
  const [tipoCadastro, setTipoCadastro] = useState<TipoCadastro>('candidato');
  
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
  
  const [formData, setFormData] = useState<FormDataCandidato>({
    nome: '',
    email: '',
    confirmarEmail: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
    deficiencia: '',
    subtipoDeficiencia: '',
    barreira: [],
    acessibilidade: [],
  });

  const [formDataEmpresa, setFormDataEmpresa] = useState<FormDataEmpresa>({
    nomeFantasia: '',
    razaoSocial: '',
    email: '',
    confirmarEmail: '',
    senha: '',
    confirmarSenha: '',
    cnpj: '',
    telefone: '',
    acessibilidade: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormDataCandidato, string>>>({});

  // Função para mostrar popup personalizado
  const showPopup = (type: 'success' | 'error', message: string) => {
    setPopup({ show: true, type, message });
    setTimeout(() => {
      setPopup({ show: false, type, message: '' });
    }, 4000);
  };

  // Buscar dados da API ao montar o componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAnalitycs();
        console.log('Dados recebidos da API:', response);
        
        // A API retorna { message: [...] }
        const data = response.message || [];
        
        // Organizar subtipos por tipo de deficiência
        const subtipos = {
          visual: [] as Array<{id: string, nome: string}>,
          motora: [] as Array<{id: string, nome: string}>,
          auditiva: [] as Array<{id: string, nome: string}>
        };
        
        const barreiras = {
          visual: [] as string[],
          motora: [] as string[],
          auditiva: [] as string[]
        };
        
        const acessibilidades = {
          visual: [] as string[],
          motora: [] as string[],
          auditiva: [] as string[]
        };
        
        const acessEmpresa: string[] = [];
        
        // Processar os dados retornados
        if (Array.isArray(data)) {
          data.forEach((item: any) => {
            const tipoDeficiencia = item.tipo_deficiencia;
            const subtipoId = item.id_subtipo_deficiencia;
            const subtipoNome = item.subtipo_deficiencia;
            const barreira = item.descricao_barreira;
            const acessibilidade = item.descricao_acessibilidade;
            
            // Identificar o tipo de deficiência e organizar os dados
            if (tipoDeficiencia === 'Deficiencia Visual') {
              // Adicionar subtipo com ID
              if (subtipoId && subtipoNome && !subtipos.visual.find(s => s.id === subtipoId)) {
                subtipos.visual.push({ id: subtipoId, nome: subtipoNome });
              }
              // Adicionar barreira
              if (barreira && !barreiras.visual.includes(barreira)) {
                barreiras.visual.push(barreira);
              }
              // Adicionar acessibilidade
              if (acessibilidade && !acessibilidades.visual.includes(acessibilidade)) {
                acessibilidades.visual.push(acessibilidade);
              }
            } else if (tipoDeficiencia === 'Deficiencia Motora') {
              // Adicionar subtipo com ID
              if (subtipoId && subtipoNome && !subtipos.motora.find(s => s.id === subtipoId)) {
                subtipos.motora.push({ id: subtipoId, nome: subtipoNome });
              }
              // Adicionar barreira
              if (barreira && !barreiras.motora.includes(barreira)) {
                barreiras.motora.push(barreira);
              }
              // Adicionar acessibilidade
              if (acessibilidade && !acessibilidades.motora.includes(acessibilidade)) {
                acessibilidades.motora.push(acessibilidade);
              }
            } else if (tipoDeficiencia === 'Deficiencia Auditiva') {
              // Adicionar subtipo com ID
              if (subtipoId && subtipoNome && !subtipos.auditiva.find(s => s.id === subtipoId)) {
                subtipos.auditiva.push({ id: subtipoId, nome: subtipoNome });
              }
              // Adicionar barreira
              if (barreira && !barreiras.auditiva.includes(barreira)) {
                barreiras.auditiva.push(barreira);
              }
              // Adicionar acessibilidade
              if (acessibilidade && !acessibilidades.auditiva.includes(acessibilidade)) {
                acessibilidades.auditiva.push(acessibilidade);
              }
            }
            
            // Para empresas, incluir todas as acessibilidades (sem duplicatas)
            if (acessibilidade && !acessEmpresa.includes(acessibilidade)) {
              acessEmpresa.push(acessibilidade);
            }
          });
        }
        
        console.log('Subtipos processados:', subtipos);
        console.log('Barreiras processadas:', barreiras);
        console.log('Acessibilidades processadas:', acessibilidades);
        console.log('Acessibilidades para empresa:', acessEmpresa);
        
        setSubtiposDeficiencia(subtipos);
        setBarreirasPorDeficiencia(barreiras);
        setAcessibilidadesPorDeficiencia(acessibilidades);
        setAcessibilidadesEmpresa(acessEmpresa);
        
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
      }
    };
    
    fetchData();
  }, []);

  const formatCPF = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const formatPhone = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
    if (numbers.length <= 12)
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Aplicar formatação para CPF
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    }
    
    // Aplicar formatação para telefone
    if (name === 'telefone') {
      formattedValue = formatPhone(value);
    }
    
    setFormData((prev: FormDataCandidato) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Limpar campos dependentes quando a deficiência mudar
    if (name === 'deficiencia') {
      setFormData((prev: FormDataCandidato) => ({
        ...prev,
        subtipoDeficiencia: '',
        barreira: [],
        acessibilidade: [],
      }));
    }
  };

  // Função para lidar com checkboxes de barreira
  const handleBarreiraChange = (barreira: string) => {
    setFormData((prev) => {
      const barreiras = prev.barreira.includes(barreira)
        ? prev.barreira.filter((b) => b !== barreira)
        : [...prev.barreira, barreira];
      return { ...prev, barreira: barreiras };
    });
  };

  // Função para lidar com checkboxes de acessibilidade
  const handleAcessibilidadeChange = (acessibilidade: string) => {
    setFormData((prev) => {
      const acessibilidades = prev.acessibilidade.includes(acessibilidade)
        ? prev.acessibilidade.filter((a) => a !== acessibilidade)
        : [...prev.acessibilidade, acessibilidade];
      return { ...prev, acessibilidade: acessibilidades };
    });
  };

  // Função para lidar com checkboxes de acessibilidade da empresa
  const handleAcessibilidadeEmpresaChange = (acessibilidade: string) => {
    setFormDataEmpresa((prev) => {
      const acessibilidades = prev.acessibilidade.includes(acessibilidade)
        ? prev.acessibilidade.filter((a) => a !== acessibilidade)
        : [...prev.acessibilidade, acessibilidade];
      return { ...prev, acessibilidade: acessibilidades };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormDataCandidato, string>> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.email !== formData.confirmarEmail) {
      newErrors.confirmarEmail = 'Os emails não coincidem';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{11}$/.test(formData.cpf.replace(/\D/g, ''))) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    }

    if (!formData.deficiencia) {
      newErrors.deficiencia = 'Selecione um tipo de deficiência';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Preparar os dados no formato esperado pela API
        const apiData = {
          name: formData.nome,
          email: formData.email,
          confirm_email: formData.confirmarEmail,
          password: formData.senha,
          confirm_password: formData.confirmarSenha,
          phone: formData.telefone.replace(/\D/g, ''), // Remove formatação
          cpf: formData.cpf.replace(/\D/g, ''), // Remove formatação
          birth_date: new Date(formData.dataNascimento),
          motor_disability: formData.deficiencia === 'motora',
          hearing_disability: formData.deficiencia === 'auditiva',
          visual_disability: formData.deficiencia === 'visual',
          sub_type: formData.subtipoDeficiencia, // Agora envia o ID do subtipo (ex: "DMOTO-123456")
          barrier: formData.barreira.join(', '), // Converte array para string separada por vírgulas
          accessibility: formData.acessibilidade.join(', '), // Converte array para string separada por vírgulas
        };

        console.log('=== DADOS DO CADASTRO ===');
        console.log('Tipo de deficiência selecionado:', formData.deficiencia);
        console.log('ID do subtipo selecionado:', formData.subtipoDeficiencia);
        console.log('Campos booleanos de deficiência:', {
          motor_disability: apiData.motor_disability,
          hearing_disability: apiData.hearing_disability,
          visual_disability: apiData.visual_disability
        });
        console.log('Sub_type enviado:', apiData.sub_type);
        console.log('Dados COMPLETOS enviados para API:', JSON.stringify(apiData, null, 2));
        
        const response = await postCandidate(apiData);
        
        console.log('=== RESPOSTA DA API ===');
        console.log('Resposta completa:', response);
        console.log('Candidato criado com sucesso!');
        showPopup('success', 'Cadastro realizado com sucesso! Redirecionando...');
        
        // Redirecionar para a página de login após um delay
        setTimeout(() => {
          router.push('/login');
        }, 1500);
        
        // Limpar o formulário após sucesso
        setFormData({
          nome: '',
          email: '',
          confirmarEmail: '',
          senha: '',
          confirmarSenha: '',
          telefone: '',
          cpf: '',
          dataNascimento: '',
          deficiencia: '',
          subtipoDeficiencia: '',
          barreira: [],
          acessibilidade: [],
        });
      } catch (error) {
        console.error('Erro ao cadastrar:', error);
        showPopup('error', 'Erro ao realizar cadastro. Tente novamente.');
      }
    }
  };

  const validateFormEmpresa = (): boolean => {
    const newErrors: Partial<Record<keyof FormDataEmpresa, string>> = {};

    if (!formDataEmpresa.nomeFantasia.trim()) newErrors.nomeFantasia = 'Nome fantasia é obrigatório';
    if (!formDataEmpresa.razaoSocial.trim()) newErrors.razaoSocial = 'Razão social é obrigatória';
    if (!formDataEmpresa.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formDataEmpresa.email)) {
      newErrors.email = 'Email inválido';
    }
    if (formDataEmpresa.email !== formDataEmpresa.confirmarEmail) {
      newErrors.confirmarEmail = 'Os emails não coincidem';
    }
    if (!formDataEmpresa.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formDataEmpresa.senha.length < 6) {
      newErrors.senha = 'Senha deve ter no mínimo 6 caracteres';
    }
    if (formDataEmpresa.senha !== formDataEmpresa.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }
    if (!formDataEmpresa.cnpj.trim()) {
      newErrors.cnpj = 'CNPJ é obrigatório';
    } else if (!/^\d{14}$/.test(formDataEmpresa.cnpj.replace(/\D/g, ''))) {
      newErrors.cnpj = 'CNPJ inválido';
    }
    if (!formDataEmpresa.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';

    setErrors(newErrors as any);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateFormEmpresa()) {
      try {
        // Preparar os dados no formato esperado pela API
        const apiData = {
          trade_name: formDataEmpresa.nomeFantasia,
          company_name: formDataEmpresa.razaoSocial,
          email: formDataEmpresa.email,
          confirm_email: formDataEmpresa.confirmarEmail,
          password: formDataEmpresa.senha,
          confirm_password: formDataEmpresa.confirmarSenha,
          cnpj: formDataEmpresa.cnpj.replace(/\D/g, ''), // Remove formatação
          phone: formDataEmpresa.telefone.replace(/\D/g, ''), // Remove formatação
          accessibility: formDataEmpresa.acessibilidade.join(', '), // Converte array para string separada por vírgulas
        };

        console.log('Enviando dados da empresa:', apiData);
        
        const response = await postCompany(apiData);
        
        console.log('Resposta da API:', response);
        showPopup('success', 'Cadastro de empresa realizado com sucesso! Redirecionando...');

        // Redirecionar para a página de login após um delay
        setTimeout(() => {
          router.push('/login');
        }, 1500);

        // Limpar o formulário após sucesso
        setFormDataEmpresa({
          nomeFantasia: '',
          razaoSocial: '',
          email: '',
          confirmarEmail: '',
          senha: '',
          confirmarSenha: '',
          cnpj: '',
          telefone: '',
          acessibilidade: [],
        });
      } catch (error) {
        console.error('Erro ao cadastrar empresa:', error);
        showPopup('error', 'Erro ao realizar cadastro. Tente novamente.');
      }
    }
  };

  const handleInputChangeEmpresa = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cnpj') formattedValue = formatCNPJ(value);
    if (name === 'telefone') formattedValue = formatPhone(value);

    setFormDataEmpresa((prev: FormDataEmpresa) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
      {/* Header/Navbar */}
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
                href="/login"
                className="px-6 py-2 font-medium hover:opacity-80 transition"
                style={{color: '#7BB7EB'}}
              >
                Já tenho conta
              </a>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Hero Section */}
          <div className="px-8 py-10 text-center" style={{background: 'linear-gradient(to right, #7BB7EB, #52606B)'}}>
            <h1 className="text-4xl font-bold text-white mb-3">
              Crie sua Conta
            </h1>
            <p className="text-white opacity-90 text-lg">
              Junte-se a milhares de profissionais e empresas inclusivas
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setTipoCadastro('candidato')}
              className={`flex-1 py-4 px-6 text-center font-semibold text-lg transition-all relative ${
                tipoCadastro === 'candidato'
                  ? 'bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              style={tipoCadastro === 'candidato' ? {color: '#7BB7EB'} : {}}
            >
              {tipoCadastro === 'candidato' && (
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{backgroundColor: '#7BB7EB'}}></div>
              )}
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Sou Candidato</span>
              </div>
            </button>
            <button
              onClick={() => setTipoCadastro('empresa')}
              className={`flex-1 py-4 px-6 text-center font-semibold text-lg transition-all relative ${
                tipoCadastro === 'empresa'
                  ? 'bg-orange-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              style={tipoCadastro === 'empresa' ? {color: '#ECAE7D'} : {}}
            >
              {tipoCadastro === 'empresa' && (
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{backgroundColor: '#ECAE7D'}}></div>
              )}
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Sou Empresa</span>
              </div>
            </button>
          </div>

          <div className="p-8 md:p-10">

          {/* Formulário Candidato */}
          {tipoCadastro === 'candidato' && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Seção: Informações Pessoais */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{borderColor: '#7BB7EB'}}>
                📋 Informações Pessoais
              </h3>
              <div className="space-y-6">
            {/* Nome */}
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Nome Completo *
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:border-blue-400 transition shadow-sm hover:border-gray-400"
                style={{color: '#111827'}}
                placeholder="Digite seu nome completo"
              />
              {errors.nome && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.nome}
                </p>
              )}
            </div>

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
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:border-blue-400 transition shadow-sm hover:border-gray-400"
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Confirmar Email */}
            <div>
              <label
                htmlFor="confirmarEmail"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Confirmar Email *
              </label>
              <input
                type="email"
                id="confirmarEmail"
                name="confirmarEmail"
                value={formData.confirmarEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:border-blue-400 transition shadow-sm hover:border-gray-400"
                placeholder="Confirme seu email"
              />
              {errors.confirmarEmail && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.confirmarEmail}
                </p>
              )}
            </div>

            {/* Grid para CPF, Telefone e Data */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* CPF */}
              <div>
                <label
                  htmlFor="cpf"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  CPF *
                </label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:border-blue-400 transition shadow-sm hover:border-gray-400"
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
                {errors.cpf && (
                  <p className="mt-2 text-sm text-red-600 flex items-center"><svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.cpf}</p>
                )}
              </div>

              {/* Telefone */}
              <div>
                <label
                  htmlFor="telefone"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Telefone *
                </label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:border-blue-400 transition shadow-sm hover:border-gray-400"
                  placeholder="(00) 00000-0000"
                />
                {errors.telefone && (
                  <p className="mt-2 text-sm text-red-600 flex items-center"><svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.telefone}</p>
                )}
              </div>

              {/* Data de Nascimento */}
              <div>
                <label
                  htmlFor="dataNascimento"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  id="dataNascimento"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:border-blue-400 transition shadow-sm hover:border-gray-400"
                />
                {errors.dataNascimento && (
                  <p className="mt-2 text-sm text-red-600 flex items-center"><svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    {errors.dataNascimento}
                  </p>
                )}
              </div>
            </div>
            </div>
            </div>

            {/* Seção: Segurança */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{borderColor: '#7BB7EB'}}>
                🔒 Segurança da Conta
              </h3>
              <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">

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
                name="senha"
                value={formData.senha}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:border-blue-400 transition shadow-sm hover:border-gray-400"
                placeholder="Mínimo 6 caracteres"
              />
              {errors.senha && (
                <p className="mt-2 text-sm text-red-600 flex items-center"><svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.senha}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label
                htmlFor="confirmarSenha"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Confirmar Senha *
              </label>
              <input
                type="password"
                id="confirmarSenha"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:border-blue-400 transition shadow-sm hover:border-gray-400"
                placeholder="Confirme sua senha"
              />
              {errors.confirmarSenha && (
                <p className="mt-2 text-sm text-red-600 flex items-center"><svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {errors.confirmarSenha}
                </p>
              )}
            </div>
            </div>
            </div>
            </div>

            {/* Seção: Informações sobre Deficiência */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{borderColor: '#7BB7EB'}}>
                ♿ Informações sobre Deficiência
              </h3>
              <div className="space-y-6">

            {/* Tipo de Deficiência (Radio) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tipo de Deficiência *
              </label>
              <div className="grid md:grid-cols-3 gap-3">
                <label
                  htmlFor="visual"
                  className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.deficiencia === 'visual'
                      ? 'bg-blue-50'
                      : 'border-gray-300 hover:opacity-80 bg-white'
                  }`}
                  style={formData.deficiencia === 'visual' ? {borderColor: '#7BB7EB'} : {}}
                >
                  <input
                    type="radio"
                    id="visual"
                    name="deficiencia"
                    value="visual"
                    checked={formData.deficiencia === 'visual'}
                    onChange={handleInputChange}
                    className="h-4 w-4 border-gray-300"
                    style={{accentColor: '#7BB7EB'}}
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">👁️ Visual</span>
                </label>

                <label
                  htmlFor="motora"
                  className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.deficiencia === 'motora'
                      ? 'bg-blue-50'
                      : 'border-gray-300 hover:opacity-80 bg-white'
                  }`}
                  style={formData.deficiencia === 'motora' ? {borderColor: '#7BB7EB'} : {}}
                >
                  <input
                    type="radio"
                    id="motora"
                    name="deficiencia"
                    value="motora"
                    checked={formData.deficiencia === 'motora'}
                    onChange={handleInputChange}
                    className="h-4 w-4 border-gray-300"
                    style={{accentColor: '#7BB7EB'}}
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">♿ Motora</span>
                </label>

                <label
                  htmlFor="auditiva"
                  className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.deficiencia === 'auditiva'
                      ? 'bg-blue-50'
                      : 'border-gray-300 hover:opacity-80 bg-white'
                  }`}
                  style={formData.deficiencia === 'auditiva' ? {borderColor: '#7BB7EB'} : {}}
                >
                  <input
                    type="radio"
                    id="auditiva"
                    name="deficiencia"
                    value="auditiva"
                    checked={formData.deficiencia === 'auditiva'}
                    onChange={handleInputChange}
                    className="h-4 w-4 border-gray-300"
                    style={{accentColor: '#7BB7EB'}}
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">👂 Auditiva</span>
                </label>
              </div>
              {errors.deficiencia && (
                <p className="mt-2 text-sm text-red-600 flex items-center"><svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {errors.deficiencia}
                </p>
              )}
            </div>

            {/* Subtipo de Deficiência (aparece após selecionar tipo) */}
            {formData.deficiencia && (
              <div className="animate-fadeIn">
                <label
                  htmlFor="subtipoDeficiencia"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Subtipo de Deficiência
                </label>
                <select
                  id="subtipoDeficiencia"
                  name="subtipoDeficiencia"
                  value={formData.subtipoDeficiencia}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:border-blue-400 transition shadow-sm hover:border-gray-400"
                >
                  <option value="">Selecione um subtipo</option>
                  {subtiposDeficiencia[formData.deficiencia].map((subtipo) => (
                    <option key={subtipo.id} value={subtipo.id}>
                      {subtipo.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Barreira (aparece após selecionar tipo) */}
            {formData.deficiencia && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Barreiras Principais (selecione uma ou mais)
                </label>
                <div className="grid md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-3 border border-gray-200 rounded-lg bg-gray-50">
                  {barreirasPorDeficiencia[formData.deficiencia].map((barreira, index) => (
                    <label
                      key={index}
                      className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition ${
                        formData.barreira.includes(barreira)
                          ? 'bg-blue-50'
                          : 'border-gray-300 hover:opacity-80 bg-white'
                      }`}
                      style={formData.barreira.includes(barreira) ? {borderColor: '#7BB7EB'} : {}}
                    >
                      <input
                        type="checkbox"
                        checked={formData.barreira.includes(barreira)}
                        onChange={() => handleBarreiraChange(barreira)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 flex-shrink-0"
                        style={{accentColor: '#7BB7EB'}}
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">{barreira}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Acessibilidade (aparece após selecionar tipo) */}
            {formData.deficiencia && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Recursos de Acessibilidade Necessários (selecione uma ou mais)
                </label>
                <div className="grid md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-3 border border-gray-200 rounded-lg bg-gray-50">
                  {acessibilidadesPorDeficiencia[formData.deficiencia].map((acessibilidade, index) => (
                    <label
                      key={index}
                      className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition ${
                        formData.acessibilidade.includes(acessibilidade)
                          ? 'bg-blue-50'
                          : 'border-gray-300 hover:opacity-80 bg-white'
                      }`}
                      style={formData.acessibilidade.includes(acessibilidade) ? {borderColor: '#7BB7EB'} : {}}
                    >
                      <input
                        type="checkbox"
                        checked={formData.acessibilidade.includes(acessibilidade)}
                        onChange={() => handleAcessibilidadeChange(acessibilidade)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 flex-shrink-0"
                        style={{accentColor: '#7BB7EB'}}
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">{acessibilidade}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            </div>
            </div>

            {/* Botão de Submit */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full text-white py-4 px-6 rounded-lg font-semibold text-lg hover:opacity-90 focus:outline-none focus:ring-4 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                style={{backgroundColor: '#7BB7EB', boxShadow: '0 4px 6px -1px rgba(123, 183, 235, 0.3)'}}
              >
                Criar Conta como Candidato
              </button>
            </div>
          </form>
          )}

          {/* Formulário Empresa */}
          {tipoCadastro === 'empresa' && (
            <form onSubmit={handleSubmitEmpresa} className="space-y-8">
              {/* Seção: Dados da Empresa */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{borderColor: '#ECAE7D'}}>
                  🏢 Dados da Empresa
                </h3>
                <div className="space-y-6">

              <div>
                <label htmlFor="nomeFantasia" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Fantasia *
                </label>
                <input
                  type="text"
                  id="nomeFantasia"
                  name="nomeFantasia"
                  value={formDataEmpresa.nomeFantasia}
                  onChange={handleInputChangeEmpresa}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:border-blue-400 transition shadow-sm hover:border-gray-400"
                  placeholder="Nome da empresa"
                />
              </div>

              <div>
                <label htmlFor="razaoSocial" className="block text-sm font-semibold text-gray-700 mb-2">
                  Razão Social *
                </label>
                <input
                  type="text"
                  id="razaoSocial"
                  name="razaoSocial"
                  value={formDataEmpresa.razaoSocial}
                  onChange={handleInputChangeEmpresa}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:border-blue-400 transition shadow-sm hover:border-gray-400"
                  placeholder="Razão social da empresa"
                />
              </div>

              {/* Grid para Emails */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email-empresa" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email-empresa"
                    name="email"
                    value={formDataEmpresa.email}
                    onChange={handleInputChangeEmpresa}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:border-blue-400 transition shadow-sm hover:border-gray-400"
                    placeholder="empresa@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="confirmarEmail-empresa" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmar Email *
                  </label>
                  <input
                    type="email"
                    id="confirmarEmail-empresa"
                    name="confirmarEmail"
                    value={formDataEmpresa.confirmarEmail}
                    onChange={handleInputChangeEmpresa}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:border-blue-400 transition shadow-sm hover:border-gray-400"
                    placeholder="Confirme o email"
                  />
                </div>
              </div>

              {/* Grid para CNPJ e Telefone */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cnpj" className="block text-sm font-semibold text-gray-700 mb-2">
                    CNPJ *
                  </label>
                  <input
                    type="text"
                    id="cnpj"
                    name="cnpj"
                    value={formDataEmpresa.cnpj}
                    onChange={handleInputChangeEmpresa}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:border-blue-400 transition shadow-sm hover:border-gray-400"
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                  />
                </div>

                <div>
                  <label htmlFor="telefone-empresa" className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    id="telefone-empresa"
                    name="telefone"
                    value={formDataEmpresa.telefone}
                    onChange={handleInputChangeEmpresa}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:border-blue-400 transition shadow-sm hover:border-gray-400"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
              </div>
              </div>

              {/* Seção: Segurança */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{borderColor: '#ECAE7D'}}>
                  🔒 Segurança da Conta
                </h3>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="senha-empresa" className="block text-sm font-semibold text-gray-700 mb-2">
                        Senha *
                      </label>
                      <input
                        type="password"
                        id="senha-empresa"
                        name="senha"
                        value={formDataEmpresa.senha}
                        onChange={handleInputChangeEmpresa}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:border-blue-400 transition shadow-sm hover:border-gray-400"
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmarSenha-empresa" className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirmar Senha *
                      </label>
                      <input
                        type="password"
                        id="confirmarSenha-empresa"
                        name="confirmarSenha"
                        value={formDataEmpresa.confirmarSenha}
                        onChange={handleInputChangeEmpresa}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:border-blue-400 transition shadow-sm hover:border-gray-400"
                        placeholder="Confirme a senha"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção: Acessibilidade */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{borderColor: '#ECAE7D'}}>
                  ♿ Recursos de Acessibilidade
                </h3>
                <div className="space-y-6">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Recursos de Acessibilidade Disponíveis (selecione uma ou mais)
                </label>
                <div className="grid md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-3 border border-gray-200 rounded-lg bg-gray-50">
                  {acessibilidadesEmpresa.map((acessibilidade, index) => (
                    <label
                      key={index}
                      className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition ${
                        formDataEmpresa.acessibilidade.includes(acessibilidade)
                          ? 'bg-orange-50'
                          : 'border-gray-300 hover:opacity-80 bg-white'
                      }`}
                      style={formDataEmpresa.acessibilidade.includes(acessibilidade) ? {borderColor: '#ECAE7D'} : {}}
                    >
                      <input
                        type="checkbox"
                        checked={formDataEmpresa.acessibilidade.includes(acessibilidade)}
                        onChange={() => handleAcessibilidadeEmpresaChange(acessibilidade)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 flex-shrink-0"
                        style={{accentColor: '#ECAE7D'}}
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">{acessibilidade}</span>
                    </label>
                  ))}
                </div>
              </div>
              </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full text-white py-4 px-6 rounded-lg font-semibold text-lg hover:opacity-90 focus:outline-none focus:ring-4 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  style={{backgroundColor: '#ECAE7D', boxShadow: '0 4px 6px -1px rgba(236, 174, 125, 0.3)'}}
                >
                  Criar Conta como Empresa
                </button>
                <p className="mt-4 text-sm text-gray-500 text-center">
                  Ao criar uma conta, você concorda com nossos{' '}
                  <a href="#" className="font-medium hover:opacity-80" style={{color: '#ECAE7D'}}>
                    Termos de Uso
                  </a>
                </p>
              </div>
            </form>
          )}

          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <a
              href="/login"
              className="font-semibold hover:opacity-80 transition"
              style={{color: '#7BB7EB'}}
            >
              Fazer login
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
