from lxml import etree as ET

tree = ET.parse('masterv4mini.svg')
root = tree.getroot()

def mini_url_encode(unencoded):
    encoded = unencoded.replace('<', '%3c').replace('>', '%3e').replace('{', '%7b').replace('}', '%7d').replace('#', '%23').replace(',', '%2c').replace('\'', '"').replace(';', '%3b')
    return encoded

def replace_stroke_and_stop_with_class():
    style = root.find('{http://www.w3.org/2000/svg}style')
    style.text = style.text + '.sc0{stroke:#000;}.sc1{fill:#c8c8c8;}.sc2{stop-color:#fff;}.sc3{stop-color:#c8c8c8;}'

    path_strokes = root.findall('.//{http://www.w3.org/2000/svg}path[@stroke="#000"]')
    path_fills = root.findall('.//{http://www.w3.org/2000/svg}path[@fill="#c8c8c8"]')
    gradient_starts = root.findall('.//{http://www.w3.org/2000/svg}stop[@stop-color="#fff"]')
    gradient_stops = root.findall('.//{http://www.w3.org/2000/svg}stop[@stop-color="#c8c8c8"]')

    for path in path_strokes:
        del path.attrib['stroke']
        if 'class' in path.keys():
            path.attrib['class'] += ' sc0'
        else:
            path.attrib['class'] = 'sc0'

    for path in path_fills:
        del path.attrib['fill']
        if 'class' in path.keys():
            path.attrib['class'] += ' sc1'
        else:
            path.attrib['class'] = 'sc1'

    for start in gradient_starts:
        del start.attrib['stop-color']
        if 'stop-color' in start.keys():
            start.attrib['class'] += ' sc2'
        else:
            start.attrib['class'] = 'sc2'

    for stop in gradient_stops:
        del stop.attrib['stop-color']
        if 'stop-color' in stop.keys():
            stop.attrib['class'] += ' sc3'
        else:
            stop.attrib['class'] = 'sc3'

def get_palette_colors(palette):
    paths = palette.findall('.//{http://www.w3.org/2000/svg}path')
    palette_colors = set()

    for path in paths:
        lineargradient = palette.find('./{http://www.w3.org/2000/svg}linearGradient[@id="' + path.attrib['fill'].partition('#')[2].partition(')')[0] + '"]')

        palette_colors.add(
                (
                    path.attrib['stroke'].replace('#', ''),
                    lineargradient[0].attrib['stop-color'].replace('#', ''),
                    lineargradient[1].attrib['stop-color'].replace('#', '')
                )
        )

    return sorted(list(palette_colors))

def xml_asset_to_string(asset):
    asset_string = ET.tounicode(asset).replace('\n', '')
    # remove group tag
    asset_string = asset_string.partition('>')[2].rpartition('<')[0]

    # asset_string = mini_url_encode(asset_string)
    return asset_string

def parse_xml_into_code(root):
    parts = root.findall('./{http://www.w3.org/2000/svg}g')
    text = ''
    for part in parts:
        if part.attrib['class'] == 'penis':
            wings = {}
            for sub_part in part.findall('./{http://www.w3.org/2000/svg}g'):
                part_name = sub_part.attrib['class']
    
#                if part_name == 'palette':
#                    palette_colors = get_palette_colors(sub_part)
#                    for color_group in palette_colors:
#                        text += f'\n    [bytes(\'{color_group[0]}\'), bytes(\'{color_group[1]}\'), bytes(\'{color_group[2]}\')],'
#                    replace_stroke_and_stop_with_class()
                if 'wings' in part_name:
                    for asset in sub_part:
                        if asset.attrib['class'] not in wings.keys():
                            wings[asset.attrib['class']] = []
                        else:
                            wings[asset.attrib['class']].append(asset)
                else:
                    text += f'\n\n  bytes[] private {part_name} = ['
                    for asset in sub_part:
                        asset_string = xml_asset_to_string(asset)
                        text += f'\n    bytes(\'{asset_string}\'),'
                text = text.rpartition(',')[0]
                text += '\n  ];'
            
            text += '\n\n  bytes[][] private wings = ['
            for _, wing_set in wings.items():
                print(wing_set)
                # text += '\n'
                # text += f'\n    [bytes(\'{xml_asset_to_string(wing_set[0])}\'),'
                # text += f'\n     bytes(\'{xml_asset_to_string(wing_set[1])}\')],'
            text = text.rpartition(',')[0]
            text += '\n  ];'
    return text

#print(parse_xml_into_code(root))
parse_xml_into_code(root)
