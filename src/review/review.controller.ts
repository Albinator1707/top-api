import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { ReviewModel } from './review.model';
import { REVIEW_NOT_FOUND } from './review.constants';

@Controller('review')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@Post('create')
	async create(@Body() dto: CreateReviewDto): Promise<ReviewModel> {
		return this.reviewService.create(dto);
	}

	@Delete(':id')
	async delete(@Param('id') id: string): Promise<void> {
		const deletedDoc = this.reviewService.delete(id);
		if (!deletedDoc)
			throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
	}

	@Get('byProduct/:productId')
	async getByProduct(
		@Param('productId') poductId: string,
	): Promise<ReviewModel[]> {
		return this.reviewService.findByProductId(poductId);
	}
}
