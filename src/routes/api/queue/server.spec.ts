import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET, POST } from './+server';

// Insert functions
const { valuesMock, insertMock } = vi.hoisted(() => {
	const valuesMock = vi.fn();
	const insertMock = vi.fn(() => ({ values: valuesMock }));

	return { valuesMock, insertMock };
});

// Get functions
const { fakeSong, selectMock, fromMock } = vi.hoisted(() => {
	const fakeSong = {
		song_id: '123',
		song_uri: 'spotify:track:1',
		title: 'Track Title',
		artist: 'Artist Name',
		upvotes: 0,
		downvotes: 0
	};

	return {
		fakeSong,
		selectMock: vi.fn(() => ({ from: fromMock })),
		fromMock: vi.fn().mockResolvedValue([fakeSong])
	};
});

vi.mock('$lib/server/db', () => ({
	db: {
		insert: insertMock,
		select: selectMock
	}
}));

describe('POST /api/queue', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		valuesMock.mockResolvedValue(undefined);
	});

	it('returns an error if parameters are missing', async () => {
		// This url is missing the id parameter
		const url = new URL('http://localhost:3000/api/queue?uri=u&title=t&artist=a&image=i');

		const response = await POST({ url });
		const data = await response.json();

		expect(data).toEqual({ success: false, message: 'Missing Parameters' });
		expect(insertMock).not.toHaveBeenCalled();
	});

	it('inserts a new track into the db and returns success if all params are present', async () => {
		const url = new URL('http://localhost:3000/api/queue');
		url.searchParams.set('uri', 'spotify:track:6rqhFgbbKwnb9MLmUQDhG6');
		url.searchParams.set('id', '6rqhFgbbKwnb9MLmUQDhG6');
		url.searchParams.set('img', 'http://example.com/image.jpg');
		url.searchParams.set('title', 'Track Title');
		url.searchParams.set('artist', 'Artist Name');

		const response = await POST({ url });
		const data = await response.json();

		expect(insertMock).toHaveBeenCalledOnce();
		expect(valuesMock).toHaveBeenCalledOnce();
		expect(valuesMock).toHaveBeenCalledWith({
			song_uri: 'spotify:track:6rqhFgbbKwnb9MLmUQDhG6',
			song_id: '6rqhFgbbKwnb9MLmUQDhG6',
			img_url: 'http://example.com/image.jpg',
			title: 'Track Title',
			artist: 'Artist Name'
		});
		expect(data).toEqual({ success: true });
	});

	it('returns an error if the uri is invalid', async () => {
		const url = new URL('http://localhost:3000/api/queue');
		url.searchParams.set('uri', 'spotify:track:6rqhFgbbKwnb9MLmUQDhG6');
		url.searchParams.set('id', '6rqhFgbbKwnb9MLmUQDhG6');
		url.searchParams.set('img', 'http://example.com/image.jpg');
		url.searchParams.set('title', 'Track Title');
		url.searchParams.set('artist', 'Artist Name');

		const response = await POST({ url });
		const data = await response.json();

		expect(data).toEqual({ success: false, error: 'Invalid URI' });
		expect(insertMock).not.toHaveBeenCalled();
	});

	it('returns an error if the id is not a valid base-62 identifier', async () => {
		const url = new URL('http://localhost:3000/api/queue');
		url.searchParams.set('uri', 'spotify:track:6rqhFgbbKwnb9MLmUQDhG6');
		url.searchParams.set('id', '123');
		url.searchParams.set('img', 'http://example.com/image.jpg');
		url.searchParams.set('title', 'Track Title');
		url.searchParams.set('artist', 'Artist Name');

		const response = await POST({ url });
		const data = await response.json();

		expect(data).toEqual({ success: false, error: 'Invalid ID' });
		expect(insertMock).not.toHaveBeenCalled();
	});

	it('returns an error if the image uri is not a valid url', async () => {
		const url = new URL('http://localhost:3000/api/queue');
		url.searchParams.set('uri', 'spotify:track:6rqhFgbbKwnb9MLmUQDhG6');
		url.searchParams.set('id', '6rqhFgbbKwnb9MLmUQDhG6');
		url.searchParams.set('img', 'invalidurl');
		url.searchParams.set('title', 'Track Title');
		url.searchParams.set('artist', 'Artist Name');

		const response = await POST({ url });
		const data = await response.json();

		expect(data).toEqual({ success: false, error: 'Invalid Image-URL' });
		expect(insertMock).not.toHaveBeenCalled();
	});
});

describe('GET /api/queue', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('return all items in the queue', async () => {
		const response = await GET();
		const data = await response.json();

		expect(selectMock).toHaveBeenCalledOnce();
		expect(fromMock).toHaveBeenCalledOnce();
		expect(data).toEqual([fakeSong]);
	});
});
