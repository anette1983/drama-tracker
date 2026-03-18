'use server';
/**
 * @fileOverview A Genkit flow for providing AI-powered drama and movie recommendations.
 *
 * - recommendDramasAndMovies - A function that generates drama/movie recommendations.
 * - AIDramaMovieRecommendationInput - The input type for the recommendDramasAndMovies function.
 * - AIDramaMovieRecommendationOutput - The return type for the recommendDramasAndMovies function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIDramaMovieRecommendationInputSchema = z.object({
	watchedHistory: z
		.array(z.string())
		.describe(
			'A list of titles (Korean or Chinese dramas/movies) the user has watched.',
		),
	userRatings: z
		.array(
			z.object({
				title: z.string().describe('The title of the drama or movie.'),
				rating: z
					.number()
					.int()
					.min(1)
					.max(5)
					.describe('The user-assigned rating (1-5 stars) for the content.'),
			}),
		)
		.describe(
			'A list of objects, each containing a movie/drama title and its 1-5 star user rating.',
		),
	languagePreference: z
		.enum(['Korean', 'Chinese'])
		.describe(
			"The user's preferred language for recommendations (Korean or Chinese).",
		),
});
export type AIDramaMovieRecommendationInput = z.infer<
	typeof AIDramaMovieRecommendationInputSchema
>;

const AIDramaMovieRecommendationOutputSchema = z.object({
	recommendations: z
		.array(
			z.object({
				title: z
					.string()
					.describe('The title of the recommended drama or movie.'),
				genre: z
					.string()
					.describe(
						'The primary genre of the recommended content (e.g., Romance, Action, Historical).',
					),
				description: z
					.string()
					.describe('A brief summary of the drama or movie.'),
				reasonForRecommendation: z
					.string()
					.describe(
						"A specific reason why this content is recommended based on the user's history and preferences.",
					),
			}),
		)
		.describe('A list of recommended Korean or Chinese dramas/movies.'),
});
export type AIDramaMovieRecommendationOutput = z.infer<
	typeof AIDramaMovieRecommendationOutputSchema
>;

export async function recommendDramasAndMovies(
	input: AIDramaMovieRecommendationInput,
): Promise<AIDramaMovieRecommendationOutput> {
	return recommendDramasAndMoviesFlow(input);
}

const recommendationPrompt = ai.definePrompt({
	name: 'recommendDramasAndMoviesPrompt',
	input: { schema: AIDramaMovieRecommendationInputSchema },
	output: { schema: AIDramaMovieRecommendationOutputSchema },
	prompt: `You are an AI assistant specialized in recommending Korean and Chinese dramas and movies. Your goal is to suggest new content based on the user's watched history and their ratings, focusing on content they are likely to enjoy.

Here is the user's watched history:
{{{watchedHistory}}}

Here are their ratings for some of the content:
{{{userRatings}}}

The user prefers recommendations in the {{{languagePreference}}} language. Provide 3-5 recommendations that are either Korean or Chinese dramas/movies.

For each recommendation, include the title, genre, a brief description, and a specific reason why you think the user would like it, considering their history and ratings.

Ensure the output strictly adheres to the following JSON schema described in the output.schema.`,
});

const recommendDramasAndMoviesFlow = ai.defineFlow(
	{
		name: 'recommendDramasAndMoviesFlow',
		inputSchema: AIDramaMovieRecommendationInputSchema,
		outputSchema: AIDramaMovieRecommendationOutputSchema,
	},
	async (input) => {
		const { output } = await recommendationPrompt(input);
		if (!output) {
			throw new Error('Failed to get recommendations from the AI.');
		}
		return output;
	},
);
