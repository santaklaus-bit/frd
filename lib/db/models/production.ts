import { Model, DataTypes } from "sequelize";
import sequelize from "../sequelize";

export class Production extends Model {
  public declare id: number;
  public declare slug: string;
  public declare titleFr: string;
  public declare titleEn: string;
  public declare descriptionFr: string;
  public declare descriptionEn: string;
  public declare categoryFr: string;
  public declare categoryEn: string;
  public declare detailsFr: string;
  public declare detailsEn: string;
  public declare image: string;
  public declare imageCaptionFr: string | null;
  public declare imageCaptionEn: string | null;
  public declare href: string;
  public declare pdfUrl: string | null;
  public declare isFeatured: boolean;
  public declare order: number;
  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

Production.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    titleFr: { type: DataTypes.STRING, allowNull: false },
    titleEn: { type: DataTypes.STRING, allowNull: false },
    descriptionFr: { type: DataTypes.TEXT, allowNull: false },
    descriptionEn: { type: DataTypes.TEXT, allowNull: false },
    categoryFr: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
    categoryEn: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
    detailsFr: { type: DataTypes.TEXT, allowNull: false },
    detailsEn: { type: DataTypes.TEXT, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: true },
    imageCaptionFr: { type: DataTypes.STRING, allowNull: true },
    imageCaptionEn: { type: DataTypes.STRING, allowNull: true },
    href: { type: DataTypes.STRING, allowNull: false },
    pdfUrl: { type: DataTypes.STRING, allowNull: true },
    isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
    order: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { sequelize, modelName: "Production" }
);
