import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsArray } from 'class-validator';

@Entity()
export class Product {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true
  })
  title: string

  @Column('float', {
    default: 0
  })
  price: number

  @Column({
    type: 'text',
    nullable: true
  })
  description: string

  @Column({
    type: 'text',
    unique: true
  })
  slug: string

  @Column({
    type: 'int',
    default: 0
  })
  stock: number

  @Column({
    type: 'text',
    array: true
  })
  sizes: string[]

  @Column({
    type: 'text'
  })
  gender: string

  @Column({
    type: 'text',
    array: true,
    default: []
  })
  tags: string[]

  @BeforeInsert()
  validateSlug() {
    if (!this.slug) {
      this.slug = this.title.toLowerCase();
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(/[^a-zA-Z0-9\s]/g, '')
      .replaceAll(/\s+/g, '_')

  }

  @BeforeUpdate()
  validateUpdateSlug() {
    if (this.slug) {
      this.slug = this.slug.toLowerCase()
        .replaceAll(/[^a-zA-Z0-9\s]/g, '')
        .replaceAll(/\s+/g, '_')
    }
  }

}
