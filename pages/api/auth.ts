import { NextApiRequest, NextApiResponse } from "next";

interface FormData {
  name: string;
  email: string;
  password: string;
  terms: boolean;
  token: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const formData: FormData = req.body;

  const human = await validateHuman(formData.token);
  if (!human) {
    res.status(400);
    res.json({ errors: ["Eres un robot."] });
    return;
  }

  const errors = await validateData(formData);
  if (errors.length > 0) {
    res.status(400);
    res.json({ errors });
    return;
  }

  res.status(201);
  res.json({ message: "Éxito!" });
};

async function validateHuman(token: string): Promise<boolean> {
  const secret = "6LffUUgaAAAAAN0vlQwyLEwrnfa8EwKVUMz5KG0s";
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
    {
      method: "POST",
    }
  );
  const data = await response.json();
  return data.success;
}

async function validateData(formData: FormData): Promise<Array<string>> {
  const errors = [];
  const emails = ["used@email.com"];

  if (emails.includes(formData.email)) {
    errors.push("Email already used");
  }

  return errors;
}
