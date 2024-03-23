import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  FilterQuery,
  Model,
  PopulateOptions,
  SortOrder,
  UpdateQuery,
  Document,
  Types,
} from 'mongoose';
import {
  PaginationDto,
  PaginationResponseDto,
} from 'src/utils/dto/paginate.dto';

@Injectable()
export class BaseService<C> {
  private readonly _logger = new Logger(
    this.model.name + ' ' + BaseService.name,
  );

  constructor(readonly model: Model<C>) { }

  async save(doc: Document<{ _id: Types.ObjectId }, any, C>) {
    return doc.save();
  }

  create(data: Partial<C>) {
    return this.model.create(data);
  }

  async paginatedResult(
    query: Partial<PaginationDto>,
    filter: FilterQuery<C>,
    sort?: string | { [key: string]: SortOrder },
    population?: Array<PopulateOptions> | any,
  ): Promise<PaginationResponseDto<C>> {
    const { limit = 10, page = 1 } = query;
    const [foundItems, count] = await Promise.all([
      this.model
        .find(filter)
        .skip((page - 1) * limit)
        .sort(sort ?? { createdAt: -1 })
        .limit(limit + 2)
        .populate(population ? population : []),
      this.model.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(count / limit);

    const nextPage =
      count > limit ? (page < totalPages ? page + 1 : null) : null;
    return {
      limit,
      nextPage,
      currentPage: page,
      totalNumberOfItems: count,
      foundItems,
    };
  }

  async countDocuments(filter?: FilterQuery<C>) {
    return this.model.countDocuments(filter);
  }

  async insertMany(model: C[]) {
    return await this.model.insertMany(model, {});
  }
  async findOneAndUpdateOrErrorOut(
    filter: FilterQuery<C>,
    data: UpdateQuery<C>,
    population?: Array<PopulateOptions>,
  ) {
    try {
      const result = await this.model
        .findOneAndUpdate(filter, data, {
          new: true,
        })
        .populate(population ? population : []);
      if (!result)
        throw new BadRequestException(`${this.model.modelName} not found`);

      return result;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  async findByIdAndUpdateOrErrorOut(
    id: string,
    data: UpdateQuery<C>,
    population?: Array<PopulateOptions>,
  ) {
    try {
      const result = await this.model
        .findByIdAndUpdate(id, data, {
          new: true,
        })
        .populate(population ? population : []);
      if (!result)
        throw new BadRequestException(`${this.model.modelName} not found`);
      return result;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  deleteById(id: string) {
    return this.model.findByIdAndDelete(id);
  }
  async deleteByIdOrErrorOut(id: string) {
    const deletedRecord = await this.model.findByIdAndDelete(id);
    if (deletedRecord) return deletedRecord;
    throw new NotFoundException(
      `${this.model.modelName} record with id ${id} not found`,
    );
  }

  async deleteMany(filter: FilterQuery<C>) {
    const deletedDataInfo = await this.model.deleteMany(filter);
    if (!deletedDataInfo)
      throw new NotFoundException(
        `error deleting ${this.model.modelName} records`,
      );
    return deletedDataInfo;
  }
  async findById(id: string, population?: Array<PopulateOptions>) {
    return this.model.findById(id).populate(population ? population : []);
  }

  async findOneSelectAndPopulateOrErrorOut(
    filter: FilterQuery<C>,
    select?: string | string[],
    populate?: Array<PopulateOptions>,
  ) {
    try {
      const data = await this.model
        .findOne(filter)
        .select(select ? select : '')
        .populate(populate ? populate : [])
        .catch((error) => {
          this._logger.error(error);
        });
      if (!data)
        throw new NotFoundException(`error finding ${this.model.modelName}`);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        `error finding ${this.model.modelName}`,
      );
    }
  }

  async findByIdOrErrorOut(id: string, population?: Array<PopulateOptions>) {
    const found = await this.model
      .findById(id)
      .populate(population ? population : []);
    if (!found)
      throw new NotFoundException(`${this.model.modelName} not found`);
    return found;
  }
  async findByIdAndUpdate(
    id: string,
    data: UpdateQuery<C>,
    population?: Array<PopulateOptions>,
  ) {
    try {
      const foundRecord = await this.model
        .findByIdAndUpdate(id, data, {
          new: true,
        })
        .populate(population ? population : []);
      return foundRecord;
    } catch (e) {
      this._logger.error(e);
      throw new InternalServerErrorException(e.message);
    }
  }
  async updateOneOrErrorOut(filter: FilterQuery<C>, data: UpdateQuery<C>) {
    const updateResult = await this.model.updateOne(filter, data, {
      new: true,
    });
    if (!updateResult.matchedCount)
      throw new NotFoundException(`${this.model.modelName} not found`);
    return updateResult;
  }
  async updateOne(filter: FilterQuery<C>, data: UpdateQuery<C>) {
    return await this.model.updateOne(filter, data, {
      new: true,
    });
  }
  async updateMany(
    filter: FilterQuery<C>,
    data: UpdateQuery<C>,
    population?: Array<PopulateOptions>,
  ) {
    try {
      const foundRecord = await this.model
        .updateMany(filter, data, {
          new: true,
        })
        .populate(population ? population : []);
      return foundRecord;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async updateManyOrErrorOut(
    filter: FilterQuery<C>,
    data: UpdateQuery<C>,
    population?: PopulateOptions,
  ) {
    try {
      const response = await this.model
        .updateMany(filter, data, {
          new: true,
        })
        .populate(population ? population : []);
      if (!response)
        throw new BadRequestException(
          `error updating ${this.model.modelName} `,
        );
      return response;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
  async updateByIdErrorOut(
    id: string,
    data: UpdateQuery<C>,
    population?: Array<PopulateOptions> | any,
  ) {
    try {
      const foundRecord = await this.model
        .findByIdAndUpdate(id, data, {
          new: true,
        })
        .populate(population ? population : []);
      if (!foundRecord)
        throw new NotFoundException(
          `${this.model.modelName}  record not found`,
        );
      return foundRecord;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
  findOne(data: FilterQuery<C>, populate?: Array<PopulateOptions>) {
    return this.model.findOne(data).populate(populate ? populate : []);
  }
  find(data: FilterQuery<C>, populate?: Array<PopulateOptions>) {
    return this.model.find(data).populate(populate ? populate : []);
  }

  async findOrErrorOut(
    data: FilterQuery<C>,
    populate?: Array<PopulateOptions>,
  ) {
    const results = await this.model
      .find(data)
      .populate(populate ? populate : []);
    if (!results.length)
      throw new NotFoundException(`${this.model.modelName} records not found`);

    return results;
  }
  async findOneOrErrorOut(
    data: FilterQuery<C>,
    populate?: Array<PopulateOptions>,
  ) {
    const foundRecord = await this.findOne(data).populate(
      populate ? populate : [],
    );

    if (!foundRecord)
      throw new NotFoundException(`${this.model.modelName} record not found`);

    return foundRecord;
  }

  epochTimeToUTCDateString(date: number) {
    return new Date(date).toUTCString();
  }
}
