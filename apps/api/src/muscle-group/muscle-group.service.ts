import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMuscleGroupDto } from './dto/create-muscle-group.dto';

@Injectable()
export class MuscleGroupService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateMuscleGroupDto) {
    return this.prisma.muscleGroup.create({ data: body });
  }

  async findAll() {
    return this.prisma.muscleGroup.findMany();
  }

  async findOne(id: number) {
    return this.prisma.muscleGroup.findUnique({ where: { id } });
  }

  async delete(id: number) {
    return this.prisma.muscleGroup.delete({ where: { id } });
  }

  async update(id: number, body: CreateMuscleGroupDto) {
    return this.prisma.muscleGroup.update({ where: { id }, data: body });
  }
}
