import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class repositorySHA {
  @Prop()
  repository: string;

  @Prop()
  SHA: string;
}

export const repositorySHASchema = SchemaFactory.createForClass(repositorySHA);
