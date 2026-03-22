import { Model, DataTypes } from "sequelize";
import sequelize from "../sequelize";

export class Initiative extends Model {
  public declare id: number;
  public declare slug: string;
  public declare icon: string;
  public declare titleFr: string;
  public declare titleEn: string;
  public declare descriptionFr: string;
  public declare descriptionEn: string;
  public declare detailsFr: string;
  public declare detailsEn: string;
  public declare image: string;
  public declare categoryFr: string;
  public declare categoryEn: string;
  public declare link: string;
  public declare order: number;
  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

Initiative.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    icon: { type: DataTypes.STRING, allowNull: false },
    titleFr: { type: DataTypes.STRING, allowNull: false },
    titleEn: { type: DataTypes.STRING, allowNull: false },
    descriptionFr: { type: DataTypes.TEXT, allowNull: false },
    descriptionEn: { type: DataTypes.TEXT, allowNull: false },
    detailsFr: { type: DataTypes.TEXT, allowNull: true },
    detailsEn: { type: DataTypes.TEXT, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true },
    categoryFr: { type: DataTypes.STRING, allowNull: false },
    categoryEn: { type: DataTypes.STRING, allowNull: false },
    link: { type: DataTypes.STRING },
    order: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { sequelize, modelName: "Initiative" }
);
