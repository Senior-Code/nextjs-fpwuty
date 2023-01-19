import type { NextApiRequest, NextApiResponse } from "next";
import db from "src/lib/firestore";
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (req.method === "DELETE") {
    db.doc(id.toString()).delete();
    return res.status(201).json({ Response: "success" });
  } else if (req.method === "PUT") {
    const { todo, isComplete } = req.body;
    if (isComplete === true || isComplete === false) {
      db.doc(id.toString())
        .update({ isComplete })
        .then((data) => {
          if (data) {
            return res.status(200).json({ Response: "success" });
          }
        });
    } else if (todo) {
      db.doc(id.toString())
        .update({ todo })
        .then((data) => {
          if (data) {
            return res.status(200).json({ Response: "success" });
          }
        });
    } else {
      return res.status(404);
    }
  } else {
    return res.status(201).json({ Response: "success" });
  }
};
