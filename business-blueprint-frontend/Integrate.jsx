import BlueprintPreview from '../components/BlueprintPreview';
import ExportButtons from '../components/ExportButtons';
import ExportDocx from '../components/ExportDocx';

const UploadPage = () => {
  const [blueprint, setBlueprint] = useState(null);

  const handleParsedData = (parsedRequirements) => {
    const mapped = mapToBlueprint(parsedRequirements); // use your mapping function
    setBlueprint(mapped);
  };

  return (
    <div>
      {/* UploadForm and ParsedPreview */}
      {blueprint && (
        <>
          <BlueprintPreview blueprint={blueprint} />
          <ExportButtons />
          <ExportDocx blueprint={blueprint} />
        </>
      )}
    </div>
  );
};
