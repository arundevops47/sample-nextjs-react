import ImageUploader from "@components/common/image-uploader";
import FileUploader from "@components/common/file-uploader";
import { Controller } from "react-hook-form";

interface FileInputProps {
  control: any;
  name: string;
  multiple?: boolean;
	type: string;
	endpoint?: string;
}

const FileInput = ({ control, name, multiple = true, type = 'image'}: FileInputProps) => {
	if(type == 'image') {
		return (
			<Controller
				control={control}
				name={name}
				defaultValue={[]}
				render={({ field: { ref, ...rest } }) => (
					<ImageUploader {...rest} multiple={multiple} type={type}/>
				)}
			/>
		);
	}
	else {
		return (
			<Controller
				control={control}
				name={name}
				defaultValue={[]}
				render={({ field: { ref, ...rest } }) => (
					<FileUploader {...rest} multiple={multiple} type={type}/>
				)}
			/>
		);
	}
};

export default FileInput;
