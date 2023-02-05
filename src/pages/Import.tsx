import React, { useState, useRef } from "react";
import { read, utils } from "xlsx";
import { SheetRows } from "../components/SheetRows";
import { InputContainer, SelectorContainer, StyledForm, StyledSelector, StyledLabel, StyledSubmit } from "../components/styles/Import.style";

const Import = () => {

    const [sheetData, setSheetData] = useState<string[][]>([[]]);

    const file = useRef<string[][]>([[]]);
    const columns = useRef<string[]>([]);
    const wordIndex = useRef<number>(0);
    const translationIndex = useRef<number>(1);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const filteredSheet: string[][] = file.current
        .filter( (data: string[], index: number) => {
            if (!data[wordIndex.current] || !data[translationIndex.current] ||index === 0) return false
            return true;
          })
        .map((data: string[]) => {
            return [ data[wordIndex.current], data[translationIndex.current]]
        });
        setSheetData(filteredSheet);
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const localFile = (e.target.files[0]);
            const data = await localFile.arrayBuffer();
            const workbook = read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData: string[][] = utils.sheet_to_json(worksheet, {
                header: 1
            })
            file.current = jsonData
            columns.current = jsonData[0];
            
            console.log(columns.current.length)
        }
    }

    const handleSelector = (e: React.ChangeEvent<HTMLSelectElement>,column: React.MutableRefObject<number>) => {
        column.current = columns.current.indexOf(e.target.value);
    }
    
    return (
        <main>
            <InputContainer>
                <StyledForm onSubmit={e => handleSubmit(e)}>

                    <h1>Data importing</h1>

                    <StyledLabel className="buttonClass" htmlFor="file">
                        Upload xlsx
                    </StyledLabel>
                    <input 
                    type="file"
                    id="file"
                    accept=".xlsx"
                    onChange={(e) => handleFileUpload(e)}
                    />

                    {columns.current.length === 1 ? <></> :
                    <SelectorContainer>
                        <StyledSelector onChange={ (e: React.ChangeEvent<HTMLSelectElement>) => handleSelector(e, wordIndex)}>
                            {columns.current.map((data: string, index: number) => (
                                <option key={index} value={data}>{data}</option>
                            ))}
                        </StyledSelector>
                        <StyledSelector onChange={ (e: React.ChangeEvent<HTMLSelectElement>) => handleSelector(e, translationIndex)}>
                            {columns.current.map((data: string, index: number) => (
                                <option key={index} value={data}>{data}</option>
                            ))}
                        </StyledSelector>
                    </SelectorContainer>
                    }
                    <StyledSubmit type="submit" value="Generate" />
                    
                </StyledForm>

                {sheetData.length === 0 && <SheetRows sheet={sheetData}/>}
            </InputContainer>
        </main>
    );
}

export default Import;