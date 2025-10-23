import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';
import { Job } from './Job';

// Define application status enum
export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  SHORTLISTED = 'shortlisted',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted'
}

// Define application attributes interface
export interface ApplicationAttributes {
  id: number;
  studentId: number;
  jobId: number;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeUrl?: string;
  appliedAt: Date;
  reviewedAt?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define optional attributes for creation
export interface ApplicationCreationAttributes extends Optional<ApplicationAttributes, 'id' | 'status' | 'appliedAt' | 'createdAt' | 'updatedAt'> {}

// Define Application model class
export class Application extends Model<ApplicationAttributes, ApplicationCreationAttributes> implements ApplicationAttributes {
  public id!: number;
  public studentId!: number;
  public jobId!: number;
  public status!: ApplicationStatus;
  public coverLetter?: string;
  public resumeUrl?: string;
  public appliedAt!: Date;
  public reviewedAt?: Date;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance method to check if application is pending
  public isPending(): boolean {
    return this.status === ApplicationStatus.PENDING;
  }

  // Instance method to check if application is reviewed
  public isReviewed(): boolean {
    return this.status !== ApplicationStatus.PENDING;
  }

  // Instance method to check if application is accepted
  public isAccepted(): boolean {
    return this.status === ApplicationStatus.ACCEPTED;
  }

  // Instance method to check if application is rejected
  public isRejected(): boolean {
    return this.status === ApplicationStatus.REJECTED;
  }

  // Instance method to get status display name
  public getStatusDisplay(): string {
    const statusMap = {
      [ApplicationStatus.PENDING]: 'Pending',
      [ApplicationStatus.REVIEWED]: 'Reviewed',
      [ApplicationStatus.SHORTLISTED]: 'Shortlisted',
      [ApplicationStatus.REJECTED]: 'Rejected',
      [ApplicationStatus.ACCEPTED]: 'Accepted'
    };
    return statusMap[this.status];
  }

  // Instance method to get status color for UI
  public getStatusColor(): string {
    const colorMap = {
      [ApplicationStatus.PENDING]: 'orange',
      [ApplicationStatus.REVIEWED]: 'blue',
      [ApplicationStatus.SHORTLISTED]: 'green',
      [ApplicationStatus.REJECTED]: 'red',
      [ApplicationStatus.ACCEPTED]: 'green'
    };
    return colorMap[this.status];
  }
}

// Initialize Application model
Application.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Job,
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ApplicationStatus)),
      allowNull: false,
      defaultValue: ApplicationStatus.PENDING,
    },
    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 2000],
      },
    },
    resumeUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    appliedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true,
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000],
      },
    },
  },
  {
    sequelize,
    tableName: 'applications',
    timestamps: true,
    indexes: [
      {
        fields: ['studentId'],
      },
      {
        fields: ['jobId'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['appliedAt'],
      },
      {
        unique: true,
        fields: ['studentId', 'jobId'],
        name: 'unique_student_job_application',
      },
    ],
    hooks: {
      // Set reviewedAt when status changes from pending
      beforeUpdate: async (application: Application) => {
        if (application.changed('status') && 
            application.status !== ApplicationStatus.PENDING && 
            !application.reviewedAt) {
          application.reviewedAt = new Date();
        }
      },
    },
  }
);

// Define associations
Application.belongsTo(User, {
  foreignKey: 'studentId',
  as: 'student',
});

Application.belongsTo(Job, {
  foreignKey: 'jobId',
  as: 'job',
});

User.hasMany(Application, {
  foreignKey: 'studentId',
  as: 'applications',
});

Job.hasMany(Application, {
  foreignKey: 'jobId',
  as: 'applications',
});

export default Application;
