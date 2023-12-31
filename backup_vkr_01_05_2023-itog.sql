PGDMP     .                    {            vkr    15.2    15.2                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                        0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            !           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            "           1262    16398    vkr    DATABASE     w   CREATE DATABASE vkr WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';
    DROP DATABASE vkr;
                postgres    false            �            1259    16435    answers    TABLE     �   CREATE TABLE public.answers (
    answer_id integer NOT NULL,
    question_id integer NOT NULL,
    answer_text character varying(500) NOT NULL,
    answer_right boolean NOT NULL
);
    DROP TABLE public.answers;
       public         heap    postgres    false            �            1259    16434    answers_answer_id_seq    SEQUENCE     �   ALTER TABLE public.answers ALTER COLUMN answer_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.answers_answer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    223            �            1259    16400    chat    TABLE     �   CREATE TABLE public.chat (
    msg_id integer NOT NULL,
    msg_author character varying(50) NOT NULL,
    msg_text character varying(500) NOT NULL,
    msg_date date NOT NULL
);
    DROP TABLE public.chat;
       public         heap    postgres    false            �            1259    16399    chat_msg_id_seq    SEQUENCE     �   ALTER TABLE public.chat ALTER COLUMN msg_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.chat_msg_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    215            �            1259    16422 	   questions    TABLE       CREATE TABLE public.questions (
    question_id integer NOT NULL,
    theme_id integer NOT NULL,
    question_type integer NOT NULL,
    question_text character varying(500) NOT NULL,
    question_image character varying(100),
    question_number integer NOT NULL
);
    DROP TABLE public.questions;
       public         heap    postgres    false            �            1259    16421    questions_question_id_seq    SEQUENCE     �   ALTER TABLE public.questions ALTER COLUMN question_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.questions_question_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    221            �            1259    16408    teams    TABLE     �  CREATE TABLE public.teams (
    team_id integer NOT NULL,
    team_name character varying(50) NOT NULL,
    team_password character varying(50) NOT NULL,
    team_rating double precision NOT NULL,
    team_average_score double precision NOT NULL,
    team_maximum_score integer NOT NULL,
    team_leading boolean NOT NULL,
    team_count_game integer NOT NULL,
    team_image character varying(100) NOT NULL,
    team_request_role boolean NOT NULL,
    team_text_request_role character varying(500)
);
    DROP TABLE public.teams;
       public         heap    postgres    false            �            1259    16407    teams_team_id_seq    SEQUENCE     �   ALTER TABLE public.teams ALTER COLUMN team_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.teams_team_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    217            �            1259    16416    themes    TABLE     �  CREATE TABLE public.themes (
    theme_id integer NOT NULL,
    theme_name character varying(50) NOT NULL,
    theme_category1 character varying(50) NOT NULL,
    theme_category2 character varying(50) NOT NULL,
    theme_category3 character varying(50) NOT NULL,
    theme_category4 character varying(50) NOT NULL,
    theme_category5 character varying(50) NOT NULL,
    theme_author character varying(50) NOT NULL,
    theme_verified boolean NOT NULL
);
    DROP TABLE public.themes;
       public         heap    postgres    false            �            1259    16415    themes_theme_id_seq    SEQUENCE     �   ALTER TABLE public.themes ALTER COLUMN theme_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.themes_theme_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    219                      0    16435    answers 
   TABLE DATA           T   COPY public.answers (answer_id, question_id, answer_text, answer_right) FROM stdin;
    public          postgres    false    223   �%                 0    16400    chat 
   TABLE DATA           F   COPY public.chat (msg_id, msg_author, msg_text, msg_date) FROM stdin;
    public          postgres    false    215   G5                 0    16422 	   questions 
   TABLE DATA           y   COPY public.questions (question_id, theme_id, question_type, question_text, question_image, question_number) FROM stdin;
    public          postgres    false    221   �5                 0    16408    teams 
   TABLE DATA           �   COPY public.teams (team_id, team_name, team_password, team_rating, team_average_score, team_maximum_score, team_leading, team_count_game, team_image, team_request_role, team_text_request_role) FROM stdin;
    public          postgres    false    217   �>                 0    16416    themes 
   TABLE DATA           �   COPY public.themes (theme_id, theme_name, theme_category1, theme_category2, theme_category3, theme_category4, theme_category5, theme_author, theme_verified) FROM stdin;
    public          postgres    false    219   u?       #           0    0    answers_answer_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.answers_answer_id_seq', 400, true);
          public          postgres    false    222            $           0    0    chat_msg_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.chat_msg_id_seq', 1, true);
          public          postgres    false    214            %           0    0    questions_question_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.questions_question_id_seq', 50, true);
          public          postgres    false    220            &           0    0    teams_team_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.teams_team_id_seq', 3, true);
          public          postgres    false    216            '           0    0    themes_theme_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.themes_theme_id_seq', 2, true);
          public          postgres    false    218            �           2606    16441    answers answers_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY (answer_id);
 >   ALTER TABLE ONLY public.answers DROP CONSTRAINT answers_pkey;
       public            postgres    false    223            z           2606    16406    chat chat_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_pkey PRIMARY KEY (msg_id);
 8   ALTER TABLE ONLY public.chat DROP CONSTRAINT chat_pkey;
       public            postgres    false    215            �           2606    16428    questions questions_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (question_id);
 B   ALTER TABLE ONLY public.questions DROP CONSTRAINT questions_pkey;
       public            postgres    false    221            |           2606    16414    teams teams_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (team_id);
 :   ALTER TABLE ONLY public.teams DROP CONSTRAINT teams_pkey;
       public            postgres    false    217            ~           2606    16420    themes temes_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.themes
    ADD CONSTRAINT temes_pkey PRIMARY KEY (theme_id);
 ;   ALTER TABLE ONLY public.themes DROP CONSTRAINT temes_pkey;
       public            postgres    false    219            �           2606    16442    answers fk_question    FK CONSTRAINT     �   ALTER TABLE ONLY public.answers
    ADD CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES public.questions(question_id);
 =   ALTER TABLE ONLY public.answers DROP CONSTRAINT fk_question;
       public          postgres    false    3200    221    223            �           2606    16429    questions fk_themes    FK CONSTRAINT     z   ALTER TABLE ONLY public.questions
    ADD CONSTRAINT fk_themes FOREIGN KEY (theme_id) REFERENCES public.themes(theme_id);
 =   ALTER TABLE ONLY public.questions DROP CONSTRAINT fk_themes;
       public          postgres    false    3198    221    219               �  x��Z�rT�}_q���(5����ƅ�T�L%yɋ �VYF.!���p1vaB$�W�$��,!Ɍ4~�?�Zk���f�8q�9��ݻw�޽v�¹p�ͭ�p��>>���1~c�&�M��7�o���Q�TW�f�){Օ�r�_v�V��� vʖ��P�M}�����+_B�]}��r���Lh�Ak���g����  �Q0NՄ�a��ϫ���~A���#���v��[0���j�� �|˻���_�;�Ĵ�xy���W�F�1��fd�~ǌ�Jb*� ��7Nk+��	��L�Q�a	N2�G�e	|��p|p�׉+�>2~PP�#f������+����=�ђ�~�r�҃�\�����k4�˽�l��궉i�K8�V�)��[��au�;(�XOؙ֤�U�]��]��;�f�q٢����u�	�z�N����+�<�T�+�*�H����mi_���i'l{�C�L�U7٪��j�����?r
Qc���6+�� ,@_۶f�eM��=.���ל�`
���=s�E�hq�ps(j1W,f�����O��&�3��	����Q~A{�����gV*7�d/��gx�
�cG�C��==�/p,Z_f��
�����T��s�C��1�?�ݠ|��І�!�	���G8=�����n��IM��~9((�����8������⚬��b��9� ء�쿌	_5�
D:�w���f�m+�m���P��F�O�ʧ�5j���Ev��I+��7?=T2mjS'�
?�=����0�f=�27���X��y��1��E�����$Ty"���*Ð�t���by+�q]�\�C?�oir�@a
�:$E3�(mP+Dc����0P	��T���;?zxuDiS6b�l�V�3{���R����e}�=+_�w��4�(�O�6� ~j^�h�iN�M���Xf�Z�f��;��n��^���g�rc��J֠��D���E����!Ō�V����"Gц��ߑ��C	��%�碮tZ_\� ��ER&U&�,��� K�yL�d�4f��,�&�`��AnҖ�?�Am.��Z:}.{�A,�gY!�GZ���Ѽ1<� �@�6i?�!���Y;�;1��<��$�Bul�X��}�����F����v�DG�Y�����>5OT�cրQ/䈎؛�D��� �E���Ƙv!x��N-p�Lڡa$�&p�.Y��f�׊��<J���� ���`S;��Q����8ԡ�`�(]�K��;'��E���Sl5��sK)F�Q{���AlT]V"�nc-��j�)'r8/�u���-w%v���}�Ă΍H���hi��{�m�K�נ����#1�wqG%G*�S��ǅ7���F&�ز�[S#�Ƒ}?�SHgR�1������`m�d�d��{<��su��6
�Wd�%,̠�7��Tߪns�P%���w!X�n�h60K}JRI�'��f���D:���+�kZ����6�'J�ƽ�[s1_ ��:�;h��>:�z��G�2��Z��?�1�A4���͖0���*z���m��*�P�g��t���SoI[9��ZBEsٝǢ��i���Z���7lӋ����7j������-Ɠ%�zCq��BaA�lSCM1Myܡ(3B�ˎ`�>7����[��i��$=Β��2��t7 �T��Y�9�੺QD�� 3 �w�f��ën*����/QX��m��Z��wOc�yQT�� ߴt�(!����-�-�@�
�9��S��k��t3q1�/[��� �a�]�'�����;h�k[��,��I�|1��H��>@��+�F1@�XZHqV�F�Qn�+���c�}O'D	�Gr�?��un�����>&M�)��sK�.p
@�?X�lQ҈ԇ?_�:��lTB���ϗ����������g�}F�G��gV>�k�Kg/���ntr0 ��#� r&ߪI�P��8S2�w�c��0��ۺ\���'�y@^�d�̀�L��%��=Ր��/�B TQ�/�BO���Q����
M{���>]��s����,�/�l�i�ܸ��Ӹ����zJ�&�� 1Q(����n��Ębb��k�:�lH���vuC:��{J�����K��ަ�[շ��qY��PUMD�U�����sb���pV����.1|���9^P6|[��]���p�6�]I�7����ࡐ	l�� �����%��DT$v7�����6٘ �9I�;Q�N6��Wk����u�d��NR�kc|���'�7������,��k���ե/��K���?��X]Y^�D4,˙z���9����sʼ9�-H�?�d�	H�d��K�`����3_��q���KK�qH8�`H�
����s�rS^X^^�$FAƩeu �E�$�[ѷ���_j|�h��h8��i��� ߣv�0o`�p��V�ݾ)�P6)�����l�ռrX�wy�Wv����o]���1>��k�*���-�[:�N�7�D=�
���z�w�E���SD;��7wش���/���=f�P߽�m��
��tvu��W:K��VV>Y�Zu̠��_x�\��X8��L����S�
`KXM_�a������_�R}`����b�x5 W@)X�Q�i�������[
@��m)�u� fD*�y���իW��}(|f�����Z�kw�v�2�:`��n?��.�2�����a��Gא�zf㿻RrR���_f��D5�^��đ�g(�+g��r@-QT�g�����]nB�J �H��͇��4��ugwBP�?�.��e�}r��Y%@�#�8��� |a��lf�8r�?���,�H�6N����Rߗt�N�U=�2�I�����`$���*n3���-&?`[�����L8�mv�1���Uغyo�%�oXh�k�6���z�D;�M�*ȷ����-��6�l%,&�lQq"YdT"X |h�:ցE���S����MP�(=���d;��g�d��J�rFY/ rF	b �Y�TTbTnT�)Y�X�i��rO��Q	���dz��2*���"OY�ب"[X �|k��Qs1E@L���ܨ�d�Q�zH�vF���,P2*ͱ�.2�3TeV���d'P�i�,3�0Yn��� �D�j\���W�-��12���o䞗'V�^��I$e��2�(0-D"@�XWټtdXk�����=��}ſ_uu[�GjK��X>�C�_���ߖ�ЗB&��v����y.�z�勷]<�q��x�t0 ��gmgU�x���D펛?����̡�Ҡ=�[�ѿ�}鯉"T��_�B���_FF�2T��@Dv=������pl4�v�;r)?���ӻSvv>Uב���%lW�&�g�J(��jOS���Ʀ�O��գ���$>Y=��=��7���%�'-7�� �l��C���l^����B�1��F�u4�-�ş�(�vf����}��E�j�A�<��S @�����s+�.H'����?����˙���.��H�Z<��� :'}��Օ�}����+��K���w�,-��騰�*L�it"��X��-��ΐ$��e��J��$�dC���T�-[�I�{�c��٘�����&�lLg�:�%��Vѩ�k��h=�7]�8�L�N�_ٟ���S�>�JK�a��̶/M�_�J/���:j���z�1�u�e�Y�fOv�pF?�R9~��t6��%��Rv���*�BPm�1@-��� ��V+8��a��h�/N�8��Y�9���Y����Qi��U�C& -pӸϴ`��������&���m��N 	%��F� �XGGn�dT�1�6��f�Q}M���1�ɿ̚�k5rRqr��U���k���C��[h�'�8�݉'����         2   x�3�I-.Q-N-�0�bÅ6]�z������X��T���+F��� e�         G	  x��X�R���y���1���+�r��j�� ���ȈB����,8xa�[�lyR����B�#��0�
y��>ݟ4�T��5���t���z�y�o�u>�G���y7�c\��W\{/��M�U�y�������>�}��42�y���AP��|R�{򥛏��|࠷�%�N�˸�(N`����Ӥ�ȏa6��n�,^�µ:6)�2|=�dy�8��U>(�����0��L,fy�8��iqX�)��/p|�^�\��7r��szrT���9�6�g;{;�'���?�V��J�X �vŁ��\ˉ�ߋ�6*΋S8\b�b�t�	,�,r�҆��9����j��f/�W�V���:���A|��e���#�Hh��ꥠ����`��*zf��z&%��k��;� �?��]���uIw�8�`h�)���<��I���rmz�����?�Á�����:`��@Y�.�-N�7�^�N���V��K<�.h�4�#s���[���ޗխݧU�vïX�Sl��#�u%��6|K�K��&#�����mM�ԗ�Z�H/`y7���Ag��y�J*~�b�.��;	������8+�K����Y�s���s ?h�iWK��ɶ����x��:����&g��c��<�&`���Z&�T��afV�g�{XH� \A'j�R>��J�>i4ZJo�>��|�2p�E���K`�Q��%�HI6�<ئ�X
�����p�e��}/��0VW~e_e���
s�vQY�Lܩ70*?v]w2���ɮ!S>eɱ+8W	�,�|�D��w`R��YͤVÚ*I��s'�L���䣣M����nN=TP���.^{��Z�fi��0)3Y*9"9h��OnT������R^	e����W�Ɛ���n|8��J��)�^�D����Ȫ�ͱ�N�A��nd0j:�8�����P���Ƽ��e��:Sl��2�_�O%�?
0]�j{�74�X��6"քiw�K�al�ж\�цd���T6���h��(R� �o �f��,ٻ?6��R�p��37gF�B���I$.V�hE��������0���;b$5��W�',���L�	%Cq��}I;R7]7�]<=��B
3��ƅ~+k��S�$�����+��̃堜�o��J����j5�m+~��:G�Ӻ$� N�!����c���ila�K��)���L�8��1c�q����ǋ R�۳x����+���Μ�E�սmm�(�x�|`�C�h� F��P8_
&{H�@�T�D�?��(��"�C�e@%@����	E��8ϖ��yh0KD#���f�!���w*ZL,gT�ԋ�]OG���W�.���Oe��qm��HY�u���K����6��ۣ}A�y1c�/De������1��s����D��ς)�3{#�Bt�5�!a$#�6�-�~��E�U]��mSQ���ɮBG�Kg'R���oײ&ʜ��,l�7���!0j�yu��tk�:��^7ݹ$Ht�:Lv��'=Df�n=m��zm�x<��>�'?��i�'%ܱ{�>X}�q�GEb�PyJ5��cl��yҲ�(^1g�=�W�R����e�"��7*����|�G���G��덥�e����=
T�u�����˭l6�ğ�q���`_��'Q�Z���ƾ�)%��*B-�o�Yo�_&�E�1V/ז�X��H������!�T�Gfyk��f�� K���׻��ű��&Q��;!S�h`[�/v��Ɠ���z�V�8)���F��v>gME�O$!��_Bp��D����-y1��l4��5�������NIZF�@�O^��^��]���kڗ�M#՟�I�Yuq(vL����T9Cϵm+�=	J��J�4�w��_��,�ޮ�r^떣�ܳܺ��Ҷ1y�p,�+����Cq�il��n��c��P�Qv�xC3�ik�J�!@���T�<�9h��5�7�FWz�]�9E2٥gL���&)�Tm���1�%Y��y�Ao�?4�m0?����$��e��|���zظ�%�*@�H
�ǿh�L�tL�MDQ�û����'��$��E�#�gꍭ]��$�4�P��px^�������c*�2�&?g� `�8^�T��������~����y���l�#%e"�3�E�L��
}��RqSS�`��.�n�D�{Kϯ���g&[�:�h�w~X����ϔ��]�\Q��@�`���U���~ S�^�A�'�v���֮	�kN�'eC|��A���h�?U_T7���fc?���K%�u�s|���e1��]�L��	n��q�&�"�.'�[g���)a�ݟ����_]�w�W~��y{=]�.���=�5�sK����~!~�˚��E���?ȡ?���n��˲����$6�         �   x�3�tL��̃��f&��f\�ișX���U�Ι��e��Z\�Z�Z�YdU�@0HeJjZbiN�nfn�^A^:P�bӅ����.v_ةpa���_l���b#�1�8#��F���@�b���� �t;N         �   x���?A�뷧�H��R�:%���� +$*Q'�Y;1�,W�ލ|�!4�d�f�ߛ��T{<pױƂ���"���Af4z����&ȑ�BgD�F�4$�NP��H9R�rM�{S�փ�������_0܎$��h�G��:en���u�2
j��8�}z�}'mo\�<g<�����˂�e`?V�5~Yyg��%~�oհ3��3�n��a��     