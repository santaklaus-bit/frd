import { Model, DataTypes } from "sequelize";
import sequelize from "../sequelize";

export class Testimonial extends Model {
  public declare id: number;
  public declare nameFr: string;
  public declare nameEn: string;
  public declare roleFr: string;
  public declare roleEn: string;
  public declare contentFr: string;
  public declare contentEn: string;
  public declare image: string | null;
  public declare certified: boolean;
  public declare rating: number;
  public declare order: number;
  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

Testimonial.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nameFr: { type: DataTypes.STRING, allowNull: false },
    nameEn: { type: DataTypes.STRING, allowNull: false },
    roleFr: { type: DataTypes.STRING, allowNull: false },
    roleEn: { type: DataTypes.STRING, allowNull: false },
    contentFr: { type: DataTypes.TEXT, allowNull: false },
    contentEn: { type: DataTypes.TEXT, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: true },
    certified: { type: DataTypes.BOOLEAN, defaultValue: false },
    rating: { type: DataTypes.INTEGER, defaultValue: 5 },
    order: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { sequelize, modelName: "Testimonial" }
);
