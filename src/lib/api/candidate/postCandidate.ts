export let postCandidate = async (body: {
  name: string;
  email: string;
  confirm_email: string;
  password: string;
  confirm_password: string;
  phone: string;
  cpf: string;
  birth_date: Date;
  motor_disability: boolean;
  hearing_disability: boolean;
  visual_disability: boolean;
  sub_type: string;
  barrier: string;
  accessibility: string;
}): Promise<any> => {
  let result = await fetch('http://localhost:3001/create/candidato', {
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
