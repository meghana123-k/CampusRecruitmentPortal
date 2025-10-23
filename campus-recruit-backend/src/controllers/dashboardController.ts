// controllers/dashboardController.ts
import { Request, Response } from 'express';
import { Job } from '../models/Job';
import { Application, ApplicationStatus } from '../models/Application';
import { User, UserRole } from '../models/User';

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const role = req.userRole;
    const userId = req.userId;

    if (!role) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const data = {
      totalUsers: 0,
      totalJobs: 0,
      totalApplications: 0,
      totalStudents: 0,
      myJobs: 0,
      receivedApplications: 0,
      shortlistedCandidates: 0,
      availableJobs: 0,
      myApplications: 0,
      interviews: 0,
    };

    switch (role) {
      case UserRole.ADMIN:
        data.totalUsers = await User.count();
        data.totalJobs = await Job.count();
        data.totalApplications = await Application.count();
        data.totalStudents = await User.count({ where: { role: UserRole.STUDENT } });
        break;

      case UserRole.RECRUITER:
        if (!userId) throw new Error('User not authenticated');

        data.myJobs = await Job.count({ where: { recruiterId: userId } });

        const jobs = await Job.findAll({ where: { recruiterId: userId } });
        const jobIds = jobs.map(j => j.id);

        if (jobIds.length > 0) {
          data.receivedApplications = await Application.count({ where: { jobId: jobIds } });
          data.shortlistedCandidates = await Application.count({
            where: { jobId: jobIds, status: ApplicationStatus.SHORTLISTED },
          });
        } else {
          data.receivedApplications = 0;
          data.shortlistedCandidates = 0;
        }
        break;

      case UserRole.STUDENT:
        if (!userId) throw new Error('User not authenticated');

        data.availableJobs = await Job.count({ where: { status: 'active' } });
        data.myApplications = await Application.count({ where: { studentId: userId } });
        data.interviews = 0; // implement later if you have interview model
        break;
    }

    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};
