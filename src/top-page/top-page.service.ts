import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TopLevelCategory, TopPageModel } from './top-page.model';
import { CreateTopPageDto } from './dto/create-top-page.dto';

@Injectable()
export class TopPageService {
	constructor(
		@InjectModel(TopPageModel.name)
		private topPageModel: Model<TopPageModel>,
	) {}

	async create(dto: CreateTopPageDto): Promise<CreateTopPageDto> {
		return this.topPageModel.create(dto);
	}

	async findById(id: string): Promise<CreateTopPageDto | null> {
		return this.topPageModel.findById(id).exec();
	}

	async findByAlias(alias: string): Promise<CreateTopPageDto | null> {
		return this.topPageModel.findOne({ alias }).exec();
	}

	async findAll(): Promise<CreateTopPageDto[]> {
		return this.topPageModel.find({}).exec();
	}

	async findByCategory(firstCategory: TopLevelCategory) {
		return this.topPageModel
			.aggregate([
				{
					$match: {
						firstCategory,
					},
				},
				{
					$group: {
						_id: { secondCategory: '$secondCategory' },
						pages: { $push: { $alias: '$alias', title: '$title' } },
					},
				},
			])
			.exec();
	}

	async findByText(text: string) {
		return this.topPageModel
			.find({
				'$**': `${text}`,
			})
			.exec();
	}

	async deleteById(id: string): Promise<CreateTopPageDto | null> {
		return this.topPageModel.findByIdAndRemove(id).exec();
	}

	async updateById(
		id: string,
		dto: CreateTopPageDto,
	): Promise<CreateTopPageDto | null> {
		return this.topPageModel
			.findByIdAndUpdate(id, dto, { new: true })
			.exec();
	}
}
