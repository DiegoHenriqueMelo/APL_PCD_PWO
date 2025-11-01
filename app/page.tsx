import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
      {/* Header/Navbar */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: '#7BB7EB'}}>
                <span className="text-white font-bold text-xl">PC</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">PCDentro</span>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/login"
                className="px-6 py-2 font-medium hover:opacity-80 transition"
                style={{color: '#7BB7EB'}}
              >
                Login
              </Link>
              <Link
                href="/cadastro"
                className="px-6 py-2 text-white font-medium rounded-lg hover:opacity-90 transition shadow-md hover:shadow-lg"
                style={{backgroundColor: '#7BB7EB'}}
              >
                Cadastrar
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Oportunidades{" "}
              <span style={{color: '#7BB7EB'}}>Inclusivas</span> para Todos
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Conectamos pessoas com deficiência às melhores oportunidades de
              trabalho. Um sistema PWO moderno, acessível e feito para você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/cadastro"
                className="px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition shadow-lg hover:shadow-xl text-center"
                style={{backgroundColor: '#7BB7EB'}}
              >
                Começar Agora
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white font-semibold rounded-lg hover:bg-gray-50 transition border-2 text-center"
                style={{color: '#7BB7EB', borderColor: '#7BB7EB'}}
              >
                Já tenho conta
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-96 rounded-2xl shadow-2xl flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, #7BB7EB, #52606B)'}}>
              <svg
                className="w-64 h-64 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o PCDentro?
            </h2>
            <p className="text-xl text-gray-600">
              Recursos pensados para garantir acessibilidade e inclusão
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6" style={{backgroundColor: '#7BB7EB'}}>
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                100% Acessível
              </h3>
              <p className="text-gray-600">
                Interface totalmente adaptada para diferentes tipos de
                deficiência, garantindo autonomia e facilidade de uso.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6" style={{backgroundColor: '#ECAE7D'}}>
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Vagas Exclusivas
              </h3>
              <p className="text-gray-600">
                Conecte-se com empresas comprometidas com a inclusão e encontre
                oportunidades que valorizam suas competências.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6" style={{backgroundColor: '#ECCD7B'}}>
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Rápido e Fácil
              </h3>
              <p className="text-gray-600">
                Cadastro simplificado e processo seletivo otimizado para você
                focar no que realmente importa: sua carreira.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20" style={{background: 'linear-gradient(to right, #7BB7EB, #52606B)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-5xl font-bold mb-2">1000+</div>
              <div className="text-xl opacity-90">Vagas Disponíveis</div>
            </div>
            <div className="text-white">
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-xl opacity-90">Empresas Parceiras</div>
            </div>
            <div className="text-white">
              <div className="text-5xl font-bold mb-2">5000+</div>
              <div className="text-xl opacity-90">Candidatos Ativos</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Pronto para começar sua jornada?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Cadastre-se agora e encontre a oportunidade que você merece
          </p>
          <Link
            href="/cadastro"
            className="inline-block px-10 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition shadow-lg hover:shadow-xl text-lg"
            style={{backgroundColor: '#7BB7EB'}}
          >
            Criar Minha Conta Grátis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: '#7BB7EB'}}>
                  <span className="text-white font-bold text-xl">PC</span>
                </div>
                <span className="text-2xl font-bold">PCDentro</span>
              </div>
              <p className="text-gray-400">
                Conectando talentos PCD às melhores oportunidades.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Plataforma</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/cadastro" className="hover:text-white transition">
                    Cadastro
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition">
                    Login
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Vagas
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Acessibilidade
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PCDentro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
