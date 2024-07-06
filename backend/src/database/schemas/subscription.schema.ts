import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class subscription {
  @Prop()
  email: string;

  @Prop()
  repository: string;

  @Prop()
  subscriptionType: string;
}

export const subscriptionSchema = SchemaFactory.createForClass(subscription);
