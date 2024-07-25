import prisma from './prisma'
import { PERSONAL_DECISION_FRAMEWORK } from './decisionFramework'

export async function getFrameworkName(frameworkId: string | null): Promise<string> {
  if (!frameworkId) {
    return 'Default Personal Decision Framework'
  }

  try {
    const framework = await prisma.customFramework.findUnique({
      where: { id: frameworkId },
    })

    return framework ? framework.name : 'Unknown Framework'
  } catch (error) {
    console.error('Error fetching framework name:', error)
    return 'Unknown Framework'
  }
}