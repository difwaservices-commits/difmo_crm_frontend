import ProjectLineGraph from "./graph/Linegraph";
import ProjectPieGraph from "./graph/Piegraph";


const ProjectAnalyticsGraph = () => {
  return (
    // The 'gap-6' creates the space between them
    // 'md:grid-cols-2' forces two equal columns on desktop
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      
      {/* Container for Line Graph */}
      <div className="w-full">
         <ProjectLineGraph />
      </div>

      {/* Container for Pie Graph */}
      <div className="w-full">
         <ProjectPieGraph />
      </div>

    </div>
  );
};

export default ProjectAnalyticsGraph;