import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  SHORTLISTED = 'SHORTLISTED',
  REJECTED = 'REJECTED',
}

export class Application extends Model {
  public id!: number;
  public applicantName!: string;
  public applicantEmail!: string;
  public graduationYear?: number;
  public skills?: string;
  public coverLetter?: string;
  public status!: ApplicationStatus;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Application.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    applicantName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    applicantEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    graduationYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    skills: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ApplicationStatus)),
      allowNull: false,
      defaultValue: ApplicationStatus.PENDING,
    },
  },
  {
    sequelize,
    tableName: 'applications',
  }
);

export default Application;
