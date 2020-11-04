import { Request, Response } from 'express';

import mongoose from 'mongoose';

import Calls from '@models/Call';
import Bases from '@models/Bases';

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

export default module.exports = {
  // LISTAR TODOS OS CHAMADO
  async index(req:Request, res: Response) {
    Calls.find()
      .populate('base', 'name')
      .exec((err: Error, calls: JSON) => {
        if (err) return res.status(500).json({ err });

        return res.status(200).json({ calls });
      });
  },

  // MAIS INFORMAÇÕES DO CHAMADO ID
  async show(req: Request, res: Response) {
    Calls.findById(req.params.id)
      .populate('base', 'name')
      .exec((err: Error, call: JSON) => {
        if (err) return res.status(500).json(err);

        return res.status(200).json(call);
      });
  },

  // SALVAR CHAMADO
  async store(req: Request, res: Response) {
    try {
      const call = await Calls.create(req.body);

      Bases.findOneAndUpdate(
        { _id: req.body.base },
        // eslint-disable-next-line no-underscore-dangle
        { $push: { calls: call._id } },
        (error: Error) => {
          if (error) return res.status(500).json({ error });

          return res.status(201).json({ message: 'Chamado inserido com sucesso!', call });
        },
      );
    } catch (erro) {
      res.status(400).json({
        message: erro.message,
        erro,
      });
    }
  },

  // ATUALIZAR CHAMADO
  async update(req: Request, res: Response) {
    const call = await Calls.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.status(201).json(call);
  },

  // DELETAR CHAMADO
  async destroy(req: Request, res: Response) {
    const call = await Calls.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      mensagem: `Chamado de numero ${call.callId} deletado  com sucesso!`,
    });
  },
};
