import datasource from "../utils";
import { Request, Response } from "express";
import { Wilder } from "../entities/Wilder";

export default {
  create: (req: Request, res: Response): void => {
    const repository = datasource.getRepository("Wilder");

    repository
      .query("INSERT INTO wilder(name) VALUES (?)", [req.body.name])
      .then(
        (id) => {
          repository.query("SELECT * FROM wilder WHERE id=?", [id]).then(
            (data) => {
              res.json(data[0]);
            },
            (err) => console.error(err)
          );
        },
        (err) => {
          console.error("Error: ", err);
          res.json({ success: false });
        }
      );
  },
  findAll: (req: Request, res: Response): void => {
    const repository = datasource.getRepository("Wilder");

    repository.find({ relations: ["upvotes", "upvotes.skill"] }).then(
      (data) => {
        res.json(data);
      },
      (err) => console.error(err)
    );
  },
  find: async (req: Request, res: Response): Promise<void> => {
    /**
     * req.body → body request
     * → req.params → /api/wilders/:wilderId
     * req.query → /api/wilders?wilderId=...
     */
    const wilderId = req.params.wilderId;

    // find 1 wilder by its ID
    const data = await datasource
      .getRepository("Wilder")
      .findOneBy({ id: wilderId });

    res.json(data);
  },
  update: async (req: Request, res: Response): Promise<void> => {
    const wilderId: string = req.params.wilderId;
    const repository = datasource.getRepository(Wilder);

    const wilder = await repository.findOne({
      where: { id: Number(wilderId) },
      relations: ["skills"],
    });

    if (wilder !== null) {
      wilder.name = req.body.name;

      const updatedWilder = await repository.save(wilder, { reload: true });
      res.json(updatedWilder);
    }
  },
  delete: (req: Request, res: Response): void => {
    /**
     * 2 options:
     * - raw SQL → UPDATE
     * - TypeORM: find + save
     */
    const wilderId = req.params.wilderId;
    const repository = datasource.getRepository("Wilder");

    // raw SQL
    repository.query("DELETE FROM wilder WHERE id=?", [wilderId]).then(
      () => {
        res.json({ success: true });
      },
      (err) => {
        console.error("Error when removing: ", err);
        res.json({ success: false });
      }
    );

    /* // find 1 wilder by its ID
    // Google → typeorm get 1 item by ID
    repository.findOneBy({ id: wilderId }).then(
      (wilder) => {
        repository.remove(wilder).then(
          () => {
            res.json({ success: true });
          },
          (err) => {
            console.error("Error when removing: ", err);
            res.json({ success: false });
          }
        );
      },
      (err) => {
        console.error("Error when finding: ", err);
        res.json({ success: false });
      }
    ); */
  },
};
