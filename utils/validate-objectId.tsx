import mongoose from 'mongoose';

export function validObjectId(id: string) {
	return mongoose.Types.ObjectId.isValid(id);
}

