import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/firestore";
import { v4 } from "uuid";
import moment from "moment";
import { Timestamp } from "firebase-admin/firestore";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const id = v4();
    const { todo, isComplete } = req.body;
    if (!todo) {
      return res.status(400).json({ error: "todo field must not empty!" });
    } else {
      await db
        .add({
          id,
          todo,
          isComplete,
          createdAt: Timestamp.now(),
        })
        .then((data) => {
          if (data) {
            return res.status(201).json({ Response: "success" });
          }
          return res.status(400).json({ error: "somethingwrong" });
        })
        .catch((err) => console.error({ err }));
    }
  }
  if (req.method === "GET") {
    const result = await db.orderBy("createdAt", "desc").get();
    if (result.docs.length > 0) {
      return res.status(200).json({
        data: result.docs.map((v) => {
          return {
            id: v.id,
            todo: v.get("todo"),
            isComplete: v.get("isComplete"),
            createAt: moment(v.createTime.toDate()).format(
              "DD/MM/YYYY HH:mm:ss a"
            ),
          };
        }),
      });
    }
    return res.status(200).json({ name: "Hello, world!" });
  }
};
