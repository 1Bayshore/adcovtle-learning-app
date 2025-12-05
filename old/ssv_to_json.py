import json

output_filename = 'dictionary_out.json'

ssv_text = ""

with open('ssv_input.csv') as f:
    ssv_text = f.read()

ssv_rows = ssv_text.split('\n')
ssv_rows_columns = [x.split(';') for x in ssv_rows]

language_idxs = ssv_rows_columns[0]

output = []

for word in ssv_rows_columns[1:]:
    word_output_toadd = {}
    prev_language_idx = ""
    for i in range(0, len(word)):
        if word[i] == "":
            continue

        language_idx = language_idxs[i]
        if language_idx == f"Notes ({prev_language_idx})":
            word_output_toadd[prev_language_idx]['notes'] = word[i]
        elif language_idx == f"Data Comprehension ({prev_language_idx})":
            word_output_toadd[prev_language_idx]['dataComprehension'] = word[i]
        elif language_idx == f"Part of Speech ({prev_language_idx})":
            word_output_toadd[prev_language_idx]['partOfSpeech'] = word[i]
        else:
            word_output_toadd[language_idx] = {'word': word[i]}
            prev_language_idx = language_idx
    
    if word_output_toadd != {}:
        output.append(word_output_toadd)

with open(output_filename, 'w') as f:
    f.write(json.dumps(output, ensure_ascii=False, indent=4))
