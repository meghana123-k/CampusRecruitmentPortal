import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';
import { Job } from './Job';

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  SHORTLISTED = 'shortlisted',
  REJECTED = 'rejected',
}

interface ApplicationAttributes {
  id: number;
  studentId: number;
  jobId: number;
  resumeUrl: string;
  coverLetter?: string;
  status: ApplicationStatus;
}

type ApplicationCreation = Optional<ApplicationAttributes, 'id' | 'status'>;

export class Application extends Model<ApplicationAttributes, ApplicationCreation>
  implements ApplicationAttributes {
  public id!: number;
  public studentId!: number;
  public jobId!: number;
  public resumeUrl!: string;
  public coverLetter?: string;
  public status!: ApplicationStatus;
}

Application.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    studentId: { type: DataTypes.INTEGER, allowNull: false },
    jobId: { type: DataTypes.INTEGER, allowNull: false },
    resumeUrl: { type: DataTypes.STRING, allowNull: false },
    coverLetter: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM(...Object.values(ApplicationStatus)),
      defaultValue: ApplicationStatus.PENDING,
    },
  },
  { sequelize, tableName: 'applications' }
);

// Associations
Application.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
