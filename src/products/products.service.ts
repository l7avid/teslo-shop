import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import {validate as isUUID} from 'uuid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>

  ) { }

  async create(createProductDto: CreateProductDto) {

    try {
      const product = this.productRepository.create(createProductDto) //primero se crea
      await this.productRepository.save(product); //luego se guarda

      return product;
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  findAll(paginationDTO: PaginationDto) {

    const {limit = 10, offset = 0} = paginationDTO
    return this.productRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(term: string) {

    let product: Product;

    if(isUUID(term)) {
      product = await this.productRepository.findOneBy({id: term})
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();  
      product = await queryBuilder
        .where(`UPPER(title) = :title or slug = :slug`, {
          title: term.toUpperCase(),
          slug: term.toLowerCase()
        }).getOne()
    }

    if(!product) {
      throw new NotFoundException(`Product with ${term} associated not found`)
    } 

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);

  }

  private handleExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(`Unexpected error, check server logs`)
  }
}
