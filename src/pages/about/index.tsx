import React from 'react'
import StarBackground from '@/components/StarBackground'

export default function About() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarBackground />
      <div className="relative z-10 px-5 py-6">
        <h2 className="text-2xl font-bold text-foreground text-center mb-6">关于我们</h2>

        <div className="rounded-2xl p-6 bg-card-white">
          <p className="text-xl leading-relaxed text-foreground mb-5">
            <strong className="text-primary">趣种地</strong>是海南地区极具影响力的亲子自然教育与研学实践平台，专注为3–14岁青少年及家庭提供高品质、沉浸式、多元化的户外成长体验。
          </p>

          <p className="text-xl leading-relaxed text-foreground mb-5">
            我们依托海南得天独厚的自然生态与热带农业资源，打造集自然科普、农耕实践、文化传承、素质拓展、亲子互动于一体的综合性营地教育体系，以"体验式学习"为核心，让孩子在真实自然环境中探索、感知、成长。
          </p>

          <p className="text-xl leading-relaxed text-foreground mb-5">
            营地拥有专业的课程研发团队、经验丰富的研学导师、完善的安全保障体系与标准化服务流程，坚持"安全第一、教育为本、体验至上"的理念，已为数千家庭提供高质量亲子活动，深受家长与孩子的信赖与好评。
          </p>

          <p className="text-xl leading-relaxed text-foreground">
            未来，我们将持续深耕亲子教育领域，不断创新课程内容、升级服务体验，致力于成为海南领先、国内知名的亲子研学品牌，让更多孩子在自然中收获知识、快乐、勇气与力量，陪伴每一个家庭共同成长。
          </p>
        </div>
      </div>
    </div>
  )
}
