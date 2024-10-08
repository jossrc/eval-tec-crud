import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Client } from './entities/client.entity';
import { Model, UpdateQuery } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { FindAllClientsDto } from './dto/find-all-clients.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const clientExists = await this.findByEmail(createClientDto.email);

    if (clientExists) {
      throw new BadRequestException(
        `El correo ingresado ya se encuentra en uso: ${createClientDto.email}`,
      );
    }

    console.log("createClientDto", createClientDto);

    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(createClientDto.password, salt);

      const clientDoc = {
        ...createClientDto,
        password: hash,
        salt,
      };

      const newClient = await this.clientModel.create(clientDoc);

      return newClient;
    } catch (error) {
      throw new InternalServerErrorException(
        'Sucedió un error inesperado al intentar crear el cliente',
      );
    }
  }

  async findByEmail(email: string) {
    const client = await this.clientModel.findOne({
      email,
    });

    if (!client) {
      return null;
    }

    return client;
  }

  async findAll(filters: FindAllClientsDto) {
    const { email } = filters;

    const clients = await this.clientModel
      .find({
        $or: [
          ...(email
            ? [
                {
                  email: {
                    $regex: email,
                    $options: 'i',
                  },
                },
              ]
            : []),
        ],
      })
      .select('-__v');

    return clients;
  }

  async findById(id: string) {
    const client = await this.clientModel.findById(id);

    if (!client) {
      throw new BadRequestException(`El cliente con id: ${id} no existe`);
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    await this.findById(id);

    if (updateClientDto.email) {
      const clientExists = await this.findByEmail(updateClientDto.email);

      if (clientExists && clientExists.id.toString() !== id) {
        throw new BadRequestException(
          `El correo ingresado ya se encuentra en uso: ${updateClientDto.email}`,
        );
      }
    }

    try {
      let clientDoc: UpdateQuery<Client> = { ...updateClientDto };

      if (updateClientDto.password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(updateClientDto.password, salt);

        clientDoc = {
          ...updateClientDto,
          password: hash,
          salt,
        };
      }

      const updatedClient = await this.clientModel.findByIdAndUpdate(
        id,
        clientDoc,
        { new: true },
      );

      return updatedClient;
    } catch (error) {
      throw new InternalServerErrorException(
        'Sucedió un error inesperado al intentar actualizar el cliente',
      );
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.clientModel.deleteOne({
      _id: id,
    });

    if (deletedCount === 0) {
      throw new BadRequestException(
        `El cliente con id: ${id} no existe o ya fue eliminado`,
      );
    }

    return true;
  }
}
