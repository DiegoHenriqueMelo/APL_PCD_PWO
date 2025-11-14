export let postCompany = async (body: {
  trade_name: string;
  company_name: string;
  email: string;
  confirm_email: string;
  password: string;
  confirm_password: string;
  cnpj: string;
  phone: string;
  accessibility: string;
}): Promise<any> => {
  let result = await fetch('http://localhost:3001/create/contratante', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });
  let data = await result.json();
  return data;
};
