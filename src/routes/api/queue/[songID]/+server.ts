import { json } from '@sveltejs/kit';

export async function DELETE({ params }) {
	console.log(params.songID);
	return json([]);
}
