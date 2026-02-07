import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma ou várias disciplinas
   * @param names array de nomes
   */

  async create(names: string[]) {
    const uniqueNames = Array.from(new Set(names.map((n) => n.trim()))).filter(
      (n) => n,
    );

    // Como o SQLite não aceita skipDuplicates, fazemos um loop ou usamos transaction
    // Aqui vamos criar um por um ignorando erros de duplicata (se houver Unique no banco)
    const results = await Promise.allSettled(
      uniqueNames.map((name) =>
        this.prisma.subject.create({
          data: { name },
        }),
      ),
    );

    return { message: `${uniqueNames.length} processados com sucesso.` };
  }

  /**
   * Lista todas as disciplinas
   */
  findAll() {
    return this.prisma.subject.findMany({
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Deleta uma disciplina pelo ID
   */
  remove(id: string) {
    return this.prisma.subject.delete({
      where: { id },
    });
  }
}
