import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getCookie(req: NextRequest, name: string) {
  try {
    return req.cookies.get(name)?.value || null;
  } catch (e) {
    return null;
  }
}

// Decodifica JWT (apenas parse básico, sem validação de assinatura no middleware)
function decodeJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
}

// Verifica se o token expirou
function isTokenExpired(decoded: any): boolean {
  if (!decoded || !decoded.exp) return true;
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Obter token do cookie
  const token = getCookie(req, 'pcd_token');

  // Se não há token, redirecionar para login
  if (!token) {
    if (pathname.startsWith('/admin') || pathname.startsWith('/minhas-vagas') || pathname.startsWith('/vaga/create')) {
      const url = req.nextUrl.clone();
      url.pathname = pathname.startsWith('/admin') ? '/login/admin' : '/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Decodificar e validar token
  const decoded = decodeJWT(token);
  
  if (!decoded || isTokenExpired(decoded)) {
    // Token inválido ou expirado
    const url = req.nextUrl.clone();
    url.pathname = pathname.startsWith('/admin') ? '/login/admin' : '/login';
    
    // Limpar cookies
    const response = NextResponse.redirect(url);
    response.cookies.delete('pcd_token');
    response.cookies.delete('pcd_role');
    return response;
  }

  const userRole = decoded.role; // 'administrador', 'empresa', 'candidato'

  // Rota admin - apenas administrador
  if (pathname.startsWith('/admin')) {
    if (userRole !== 'administrador') {
      const url = req.nextUrl.clone();
      url.pathname = '/login/admin';
      return NextResponse.redirect(url);
    }
  }

  // Rotas de empresa: /minhas-vagas e /vaga/create
  if (pathname.startsWith('/minhas-vagas') || pathname.startsWith('/vaga/create')) {
    if (userRole !== 'empresa') {
      const url = req.nextUrl.clone();
      url.pathname = '/perfil';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/minhas-vagas/:path*', '/vaga/create', '/vaga/create/:path*'],
};
