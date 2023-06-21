import { IBaseResponse } from "../interfaces/base";
import { IPEPDataJSON, IPoliticallyExposedPerson } from "../interfaces/services/pep";
import { cache } from "../libs/cache";
import FetchAPI from "../libs/fetch";
import { PEP_DATA_PER_YEAR, PEP_LIST_KEY, PEP_SOURCE_URL } from "../utils/configuration";
import { handleErrors } from "../utils/errors";

export async function getPEPList(): Promise<{success: boolean, data: IPoliticallyExposedPerson[]} | IBaseResponse> {
    try {
        let pepList: any = await cache.get(PEP_LIST_KEY);
        if (pepList) {
            return {
                success: true,
                data: JSON.parse(pepList)
            }
        }
        pepList = await downloadPEPDataFromCACIAF();
        await cache.set(PEP_LIST_KEY, JSON.stringify(pepList), true);

        return {
            success: true,
            data: pepList
        }
    } catch (error) {
        return handleErrors(error);
    }
}

/**
 * This function is executed once only to download the PEPData.
 * 
 * TODO: It needs to be updated so it downloads the files once a year.
 */
async function downloadPEPDataFromCACIAF(): Promise<Array<IPoliticallyExposedPerson>> {
    const pepListPerYear: Array<IPEPDataJSON[]> = [];
    let index = 2013;
    for (const year of PEP_DATA_PER_YEAR) {
        const pepListXml = await getPEPDataFromCACIAF(PEP_SOURCE_URL + year);
        const pepListJSON = convertPEPListFromCommissionAgainstCorruptionToJSON(pepListXml, index.toString());
        pepListPerYear.push(pepListJSON);

        index++;
    }

    return formatPEPListFromCommissionAgainstCorruptionPerPerson(pepListPerYear.flat());
}


async function getPEPDataFromCACIAF(url: string): Promise<string> {
    const request = await FetchAPI.get(url);

    if (request.status > 300) {
        throw request.statusText;
    }

    return request.data;
}

function convertPEPListFromCommissionAgainstCorruptionToJSON(data: string, year: string): IPEPDataJSON[] {
    const categories: IPEPDataJSON[] = [];

    const allCategories = data.split('</Category>');

    // Initialize variables to store the current category, institution, person, and position
    let currentCategory: Record<string, any> | undefined;
    let currentInstitution: Record<string, any> | undefined;
    let currentPerson: IPEPDataJSON | undefined;

    for (const line of allCategories) {
        const categoryName = line.match(/<Category Name="(.*?)"><Institution/)?.[1];
        if(categoryName) {
            currentCategory = { name: categoryName, institution: [] }
        }
        const allInstitutions = line.split('</Institution>');
        for (const institutionLine of allInstitutions) {
            const institutionName = institutionLine.match(/<Institution Name="(.*?)" Show="False">/)?.[1];
            if (currentCategory && institutionName) {
                currentInstitution = { name: institutionName, person: [] }
                currentCategory.institution.push(currentInstitution);
            }

            const allPeople = institutionLine.split('</Position></Person>');

            for (const peopleLine of allPeople) {
                const personName = peopleLine.match(/<Person><Name>(.*?)<\/Name><Position>/)?.[1];
                const positionName = peopleLine.match(/<\/Name><Position><Name>(.*?)<\/Name>/)?.[1];
                if (currentInstitution && personName && positionName) {
                    currentPerson = { 
                        name: personName, 
                        position: positionName,
                        category: categoryName as string ?? null,
                        institution: institutionName as string ?? null,
                        year: year
                    };
                    categories.push(currentPerson);
                }
            }
        }
    }

    return categories;
}

function formatPEPListFromCommissionAgainstCorruptionPerPerson(pepList: IPEPDataJSON[]): IPoliticallyExposedPerson[] {
    const outputArray: IPoliticallyExposedPerson[] = [];
    const nameMap: { [name: string]: IPoliticallyExposedPerson } = {};
  
    pepList.forEach(obj => {
      const { name, position, category, institution, year } = obj;
  
      if (!nameMap[name]) {
        nameMap[name] = {
          name: name,
          history: []
        };
        outputArray.push(nameMap[name]);
      }
  
      nameMap[name].history.push({
        year: year,
        position: position,
        category: category,
        institution: institution
      });
    });
  
    return outputArray;
  
}