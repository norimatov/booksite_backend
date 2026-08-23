import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private repo: Repository<Category>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  create(name: string, icon?: string, colorHex?: string) {
    const category = this.repo.create({ name, icon, colorHex });
    return this.repo.save(category);
  }
}
