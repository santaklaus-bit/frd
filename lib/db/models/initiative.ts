import { Model, DataTypes } from "sequelize";
import sequelize from "../sequelize";

export class Initiative extends Model {
  public declare id: number;
  public declare slug: string;
  public declare titleFr: string;
  public declare titleEn: string;
  public declare descriptionFr: string;
  public declare descriptionEn: string;
  public declare contentFr: string;
  public declare contentEn: string;
  public declare detailsFr: string;
  public declare detailsEn: string;
  public declare categoryFr: string;
  public declare categoryEn: string;
  public declare image: string | null;
  public declare link: string | null;
  public declare order: number;
  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

Initiative.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    titleFr: { type: DataTypes.STRING, allowNull: false },
    titleEn: { type: DataTypes.STRING, allowNull: false },
    descriptionFr: { type: DataTypes.TEXT, allowNull: false },
    descriptionEn: { type: DataTypes.TEXT, allowNull: false },
    contentFr: { type: DataTypes.TEXT, allowNull: true },
    contentEn: { type: DataTypes.TEXT, allowNull: true },
    detailsFr: { type: DataTypes.TEXT, allowNull: true },
    detailsEn: { type: DataTypes.TEXT, allowNull: true },
    categoryFr: { type: DataTypes.STRING, allowNull: false },
    categoryEn: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: true },
    link: { type: DataTypes.STRING, allowNull: true },
    order: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { sequelize, modelName: "Initiative" }
);
